@echo off
set bump=minor
if not "%1" == "" set bump=%1
echo Releasing new %bump% version of Wallboardr
for /f %%i in ('npm version %bump%') do set version=%%i
grunt replace
echo New version is %version%
hg ci -m "Release %version%"
hg tag %version% -m "Tag for release %version%"
