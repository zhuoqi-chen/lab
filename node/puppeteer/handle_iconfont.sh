echo $1;
rm rf download*.zip
rm -rf tmp/font_*
wget -O download.zip $1;
unzip download.zip -d tmp
rm -rf webroot/resources/src/less/icon-font
mkdir webroot/resources/src/less/icon-font

cp -f tmp/font_*/* ./webroot/resources/src/less/icon-font/
sed -i -e 's/\(iconfont.*\)?t=[0-9]*/\.\/\1/g' webroot/resources/src/less/icon-font/iconfont.css
mv webroot/resources/src/less/icon-font/iconfont.css  webroot/resources/src/less/icon-font/iconfont.less