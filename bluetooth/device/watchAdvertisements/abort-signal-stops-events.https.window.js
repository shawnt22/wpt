// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = `AbortController stops 'advertisementreceived' ` +
    `events from being fired on the device object.`;

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();
  let abortController = new AbortController();

  await device.watchAdvertisements({signal: abortController.signal});
  assert_true(device.watchingAdvertisements);

  let advertisementreceivedPromise = new Promise(resolve => {
    device.addEventListener('advertisementreceived', e => {
      resolve();
    }, {once: true});
  });

  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);
  await advertisementreceivedPromise;

  abortController.abort();
  device.addEventListener('advertisementreceived', e => {
    assert_unreached();
  });

  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);
  assert_false(device.watchingAdvertisements);
}, test_desc);
