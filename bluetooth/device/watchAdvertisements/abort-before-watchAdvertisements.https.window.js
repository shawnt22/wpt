// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = 'watchAdvertisements() rejects if passed an aborted signal.';

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();
  let abortController = new AbortController();
  abortController.abort();

  try {
    await device.watchAdvertisements({signal: abortController.signal});
  } catch (e) {
    assert_equals(e.name, 'AbortError');
  }
  assert_false(device.watchingAdvertisements);
}, test_desc);
