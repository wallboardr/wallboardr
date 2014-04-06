#!/bin/bash
bump=${1:-minor}
echo Releasing new $bump version of Wallboardr
version=$(npm version $bump)
grunt replace
echo New version is $version
hg ci -m "Release $version"
hg tag $version -m "Tag for release $version"
