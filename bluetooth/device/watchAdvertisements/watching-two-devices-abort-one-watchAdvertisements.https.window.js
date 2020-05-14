// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = 'AbortController while watching advertisements for two ' +
    'devices stops the correct watchAdvertisements() operation.';

bluetooth_test(async () => {
  let health_thermometer_device;
  let heart_rate_device;
  {
    let {device} = await getDiscoveredHealthThermometerDevice();
    health_thermometer_device = device;
  }
  {
    let {device} = await getHeartRateDevice(
        {requestDeviceOptions: heartRateRequestDeviceOptionsDefault});
    heart_rate_device = device;
  }

  await health_thermometer_device.watchAdvertisements();

  let abortController = new AbortController();
  await heart_rate_device.watchAdvertisements({signal: abortController.signal});

  assert_true(health_thermometer_device.watchingAdvertisements);
  assert_true(heart_rate_device.watchingAdvertisements);

  abortController.abort();
  assert_true(health_thermometer_device.watchingAdvertisements);
  assert_false(heart_rate_device.watchingAdvertisements);

  let advertisementreceivedHealthThermometerPromise = new Promise(resolve => {
    health_thermometer_device.addEventListener('advertisementreceived', e => {
      assert_equals(e.device, health_thermometer_device);
      resolve();
    });
  });

  heart_rate_device.addEventListener('advertisementreceived', e => {
    assert_unreached();
  });

  await fake_central.simulateAdvertisementReceived(heart_rate_ad_packet);
  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);

  await advertisementreceivedHealthThermometerPromise;
}, test_desc);
