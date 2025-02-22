import { SCAN_MODES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getScannerInterface } from './getScannerInterface';

describe('getScannerInterface', () => {
  let mockSources, mockScanCount, DWObject, Dynamsoft;
  let onPostAllTransfersCb;
  let mockAcquireImage, mockCloseSource, mockOpenSource, mockRemoveAllImages;

  applicationContext.getScannerResourceUri.mockReturnValue('abc');

  beforeEach(() => {
    mockSources = ['Test Source 1', 'Test Source 2'];
    mockScanCount = 1;
    mockAcquireImage = jest.fn(() => onPostAllTransfersCb());
    mockCloseSource = jest.fn();
    mockOpenSource = jest.fn();
    mockRemoveAllImages = jest.fn();

    applicationContext.getScannerResourceUri.mockReturnValue('abc');

    DWObject = {
      AcquireImage: mockAcquireImage,
      CloseSource: mockCloseSource,
      ConvertToBlob: (
        indices,
        enumImageType,
        asyncSuccessFunc,
        asyncFailureFunc,
      ) => {
        const args = {
          asyncFailureFunc,
          asyncSuccessFunc,
          enumImageType,
          indices,
        };
        return asyncSuccessFunc(args);
      },
      DataSource: null,
      DataSourceStatus: 0,
      ErrorCode: 0,
      ErrorString: 'Successful!',
      GetSourceNameItems: index => mockSources[index],
      HowManyImagesInBuffer: mockScanCount,
      IfDisableSourceAfterAcquire: false,
      IfDuplexEnabled: false,
      IfFeederLoaded: true,
      OpenSource: mockOpenSource,
      RegisterEvent: (scannerEvent, cb) => {
        onPostAllTransfersCb = cb;
      },
      RemoveAllImages: mockRemoveAllImages,
      SelectSourceByIndex: idx => {
        DWObject.DataSource = idx;
        return true;
      },
      SourceCount: mockSources.length,
      UnregisterEvent: () => null,
    };

    Dynamsoft = {
      DWT: {
        EnumDWT_CapSupportedSizes: { TWSS_A4: 1 },
        EnumDWT_ImageType: { IT_PNG: 1 },
        EnumDWT_PixelType: { TWPT_RGB: 1 },
        GetWebTwain: () => DWObject,
      },
    };

    window.Dynamsoft = { ...Dynamsoft };
  });

  it('returns the TWAIN driver API', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('DWObject');
  });

  it('has a method for completing the scan process', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('completeScanSession');
    await scannerAPI.completeScanSession();
    expect(mockRemoveAllImages).toHaveBeenCalled();
    expect(mockCloseSource).toHaveBeenCalled();
  });

  it('can get the page / scan count in the current buffer', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI.getScanCount()).toEqual(mockScanCount);
  });

  it('can get an array of available scanner sources', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const sources = scannerAPI.getSources();
    expect(sources).toHaveLength(mockSources.length);
  });

  it('can get current scan errors', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const errorObj = scannerAPI.getScanError();
    expect(errorObj).toHaveProperty('code');
    expect(errorObj).toHaveProperty('message');
  });

  it('can get a data source status', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI.getSourceStatus()).toEqual(0);
  });

  it('can set a scanner source by index', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const result = scannerAPI.setSourceByIndex(1);
    expect(scannerAPI.DWObject).toBe(DWObject);
    expect(result).toBe(true);
  });

  it('can get a scanner source name by index', () => {
    const index = 1;
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const result = scannerAPI.getSourceNameByIndex(index);

    expect(scannerAPI.DWObject).toBe(DWObject);
    expect(result).toBe(mockSources[index]);
  });

  it('can set a scanner source by name', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const result = scannerAPI.setSourceByName(mockSources[0]);
    expect(scannerAPI.DWObject).toBe(DWObject);
    expect(result).toBe(true);
  });

  it('setSourceByName returns `false` when the source is not found', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const result = scannerAPI.setSourceByName('Unavailable Source');
    expect(result).toBeFalsy();
  });

  it('has a method for starting the scan process', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('startScanSession');

    await scannerAPI.startScanSession({ applicationContext });
    expect(DWObject.IfDisableSourceAfterAcquire).toBeTruthy();
    expect(mockOpenSource).toHaveBeenCalled();
    expect(mockAcquireImage).toHaveBeenCalled();
  });

  describe('startScanSessions', () => {
    afterEach(() => {
      DWObject.RemoveAllImages.mockRestore();
    });

    it('gracefully deals with failed blob conversion', async () => {
      const scannerAPI = getScannerInterface();
      jest.spyOn(DWObject, 'RemoveAllImages').mockImplementation(() => {
        throw new Error('RemoveAllImages Mock Error');
      });
      scannerAPI.setDWObject(DWObject);

      let error;
      try {
        await scannerAPI.startScanSession({ applicationContext });
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  it('throws an exception if the hopper is empty when scanning with the feeder', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject({
      ...DWObject,
      IfFeederLoaded: false,
    });

    let error;
    try {
      await scannerAPI.startScanSession({
        applicationContext,
        scanMode: SCAN_MODES.FEEDER,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('does NOT throw an exception if the hopper is empty when scanning with the flatbed', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject({
      ...DWObject,
      IfFeederLoaded: false,
    });

    let error;
    try {
      await scannerAPI.startScanSession({
        applicationContext,
        scanMode: SCAN_MODES.FLATBED,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('can enable duplex mode by calling startScanSession with scanMode set to `DUPLEX`', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(DWObject.IfDuplexEnabled).toEqual(false); // default

    await scannerAPI.startScanSession({
      applicationContext,
      scanMode: SCAN_MODES.DUPLEX,
    });
    expect(DWObject.IfDuplexEnabled).toEqual(true);

    await scannerAPI.startScanSession({
      applicationContext,
      scanMode: SCAN_MODES.FLATBED,
    });
    expect(DWObject.IfDuplexEnabled).toEqual(false);
    expect(applicationContext.getReduceImageBlob().toBlob).toHaveBeenCalled();
  });

  it('can enable flatbed scanning by calling startScanSession with scanMode set to `FLATBED`', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);

    await scannerAPI.startScanSession({
      applicationContext,
      scanMode: SCAN_MODES.FLATBED,
    });
    expect(DWObject.IfFeederEnabled).toEqual(false);

    await scannerAPI.startScanSession({
      applicationContext,
      scanMode: SCAN_MODES.FEEDER,
    });
    expect(DWObject.IfFeederEnabled).toEqual(true);
    expect(applicationContext.getReduceImageBlob().toBlob).toHaveBeenCalled();
  });

  it('should scan from feeder when calling startScanSession with scanMode set to `DUPLEX`', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);

    await scannerAPI.startScanSession({
      applicationContext,
      scanMode: SCAN_MODES.DUPLEX,
    });
    expect(DWObject.IfDuplexEnabled).toEqual(true);
    expect(DWObject.IfFeederEnabled).toEqual(true);
    expect(applicationContext.getReduceImageBlob().toBlob).toHaveBeenCalled();
  });

  it('should attempt to load the dynamsoft libraries', async () => {
    delete global.window.document;
    let calls = 0;
    global.window.document = {
      addEventListener: () => null,
      createElement: () => ({
        cloneNode() {
          return {
            ...this,
          };
        },
        onload: null,
        setAttribute: () => null,
      }),
      getElementsByTagName: () => {
        calls++;
        return [
          {
            appendChild: script => {
              script.onload();
            },
          },
        ];
      },
    };
    const scannerAPI = getScannerInterface();
    let script = await scannerAPI.loadDynamsoft({
      applicationContext,
    });
    expect(script).toEqual('dynam-scanner-injection');

    // try to load it again to verify it doesn't attempt to download the scripts again
    script = await scannerAPI.loadDynamsoft({
      applicationContext,
    });
    expect(script).toEqual('dynam-scanner-injection');
    expect(calls).toEqual(2);
  });
});
