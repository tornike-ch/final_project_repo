// Source for player/js/micah.js (bundled with esbuild, see README in this folder).
import { createAvatar } from '@dicebear/core';
import * as micah from '@dicebear/micah';

window.MicahAvatar = function (options) {
  return createAvatar(micah, options).toDataUri();
};
