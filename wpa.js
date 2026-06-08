// Register Service Worker for offline PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker Registered!'))
            .catch(err => console.error('Service Worker Failed:', err));
    });
}

// BLE UUIDs (Must be lowercase)
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHAR_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

let ledCharacteristic = null;

const connectBtn = document.getElementById('connectBtn');
const onBtn = document.getElementById('onBtn');
const offBtn = document.getElementById('offBtn');

connectBtn.addEventListener('click', async () => {
    try {
        console.log("Requesting BLE Device...");
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        console.log("Connecting to GATT Server...");
        const server = await device.gatt.connect();

        console.log("Getting Service...");
        const service = await server.getPrimaryService(SERVICE_UUID);

        console.log("Getting Characteristic...");
        ledCharacteristic = await service.getCharacteristic(CHAR_UUID);

        // Update UI state
        connectBtn.textContent = "Connected! ✅";
        connectBtn.disabled = true;
        onBtn.disabled = false;
        offBtn.disabled = false;

    } catch (error) {
        console.error("Bluetooth Connection Failed:", error);
        alert("Failed to connect. Make sure your Pico is powered on and advertising!");
    }
});

// Helper function to send data to the Pico
async function sendBLEMessage(message) {
    if (!ledCharacteristic) return;
    try {
        const encoder = new TextEncoder();
        await ledCharacteristic.writeValue(encoder.encode(message));
        console.log(`Sent: ${message}`);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

onBtn.addEventListener('click', () => sendBLEMessage("on"));
offBtn.addEventListener('click', () => sendBLEMessage("off"));
