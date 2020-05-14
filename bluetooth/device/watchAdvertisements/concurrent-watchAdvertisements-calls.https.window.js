// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = 'concurrent watchAdvertisements() calls results in the ' +
    `second call rejecting with 'InvalidStateError'`;

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();

  // Start a watchAdvertisements() operation.
  let firstWatchAdvertisementsPromise = device.watchAdvertisements();

  // Start a second watchAdvertisements() operation. This operation should
  // reject with 'InvalidStateError'.
  try {
    await device.watchAdvertisements();
  } catch (e) {
    assert_equals(e.name, 'InvalidStateError');
  }

  // The first watchAdvertisements() operation should resolve successfully.
  try {
    await firstWatchAdvertisementsPromise;
  } catch (e) {
    assert_unreached();
  }

  let advertisementreceivedPromise = new Promise(resolve => {
    device.addEventListener('advertisementreceived', e => {
      assert_equals(e.device, device);
      resolve();
    });
  });

  // This advertisement packet should not cause the event to be fired.
  await fake_central.simulateAdvertisementReceived(heart_rate_ad_packet);

  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);
  await advertisementreceivedPromise;
}, test_desc);
