npm run less
npm run example
cd ../select-gh-pages
rm -rf build/
mkdir build
cp -r ../select/build/ build
git add --all
git commit -am "update examples"
git push origin gh-pages:gh-pages