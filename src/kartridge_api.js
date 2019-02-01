const FFI = require('ffi-napi');
const ref = require('ref');
const { app } = require('electron');

const kongregate_event_listener = exports.kongregate_event_listener = FFI.Function(ref.types.void, [
  ref.types.CString,
  ref.types.CString,
]);

exports.kongregate_event_listenerPtr = ref.refType(kongregate_event_listener);

const LIBRARY_NAME = (() => {
  if (process.platform === 'win32') {
    return process.arch === 'ia32' ? 'resources\\kartridge-sdk-x86' : 'resources\\kartridge-sdk-x86_64';
  } else if (process.platform === 'darwin') {
    // Electron-specific logic here, will need to be modified for other environments
    return app.isPackaged ? `${process.resourcesPath}/libkartridge-sdk` : 'resources/libkartridge-sdk';
  }

  return '';
})();

exports.library = new FFI.Library(LIBRARY_NAME, {
  KongregateAPI_RestartWithKartridgeIfNeeded: [ref.types.uchar, [
    ref.types.uint32,
  ]],
  KongregateAPI_Initialize: [ref.types.uchar, [
    ref.types.CString,
  ]],
  KongregateAPI_Shutdown: [ref.types.void, [
  ]],
  KongregateAPI_Update: [ref.types.void, [
  ]],
  KongregateAPI_IsConnected: [ref.types.uchar, [
  ]],
  KongregateAPI_IsReady: [ref.types.uchar, [
  ]],
  KongregateAPI_SetEventListener: [ref.types.void, [
    kongregate_event_listener,
  ]],
  KongregateServices_GetUsername: [ref.types.CString, [
  ]],
  KongregateServices_GetUserId: [ref.types.uint32, [
  ]],
  KongregateServices_GetGameAuthToken: [ref.types.CString, [
  ]],
  KongregateStats_Submit: [ref.types.void, [
    ref.types.CString,
    ref.types.uint64,
  ]],
  KongregateLibrary_IsGameOwned: [ref.types.uchar, [
    ref.types.uint32,
  ]],
  KongregateLibrary_IsGameInstalled: [ref.types.uchar, [
    ref.types.uint32,
  ]],
});

exports.createEventListenerCallback = (fn) => {
  const callback = FFI.Callback(ref.types.void, [ref.types.CString, ref.types.CString], fn);
  process.on('exit', () => callback);
  return callback;
};
