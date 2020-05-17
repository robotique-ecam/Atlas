mac:
	electron-packager --platform=darwin --overwrite --arch=x64 . "Atlas Viewer - v0.1" --icon=Icon/Icon.icns

win:
	electron-packager --platform=win32 --overwrite --arch=x64 . "Atlas Viewer - v0.1" --icon=Icon/Icon.icns
