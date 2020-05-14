// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = 'AbortController stops a pending watchAdvertisements() ' +
    'operation.';

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();
  let abortController = new AbortController();

  let watchAdvertisementsPromise =
      device.watchAdvertisements({signal: abortController.signal});
  abortController.abort();
  assert_false(device.watchingAdvertisements);

  try {
    await watchAdvertisementsPromise;
  } catch (e) {
    assert_equals(e.name, 'AbortError');
  }

  device.addEventListener('advertisementreceived', e => {
    assert_unreached();
  });

  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);
}, test_desc);
