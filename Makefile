mac:
	electron-packager --platform=darwin --arch=x64 . "Atlas Viewer - v0.1" --icon=Icon/Icon.icns

win:
	electron-packager --platform=win32 --arch=x64 . "Atlas Viewer - v0.1" --icon=Icon/Icon.icns
