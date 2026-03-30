cat en.html | sed -E 's/href="[^"]*github.io([^&"]*)[^"]*"/href="..\1"/g' > out && cat out > en.html
cat ru.html | sed -E 's/href="[^"]*github.io([^&"]*)[^"]*"/href="..\1"/g' > out && cat out > ru.html
cat es.html | sed -E 's/href="[^"]*github.io([^&"]*)[^"]*"/href="..\1"/g' > out && cat out > es.html
cat pt.html | sed -E 's/href="[^"]*github.io([^&"]*)[^"]*"/href="..\1"/g' > out && cat out > pt.html
cat ru.html | sed -E 's/images\//images_ru\//g' > out && cat out > ru.html

perl -C -MHTML::Entities -pe 'decode_entities($_);' ru.html > out && cat out > ru.html

cat en.html | perl -pe 's/(<h4 .{0,80}Parametric.{0,40}<\/h4>)/<a id="graph3d"\/>  $1/g' > out && cat out > en.html
cat ru.html | perl -pe 's/(<h4 .{0,80}Параметрическая.{0,40}<\/h4>)/<a id="graph3d"\/>  $1/g' > out && cat out > ru.html
cat pt.html | perl -pe 's/(<h4 .{0,80}Superf.{1,20}cie.{0,40}<\/h4>)/<a id="graph3d"\/>  $1/g' > out && cat out> pt.html
cat es.html | perl -pe 's/(<h4 .{0,80}Superficie.{0,40}<\/h4>)/<a id="graph3d"\/>  $1/g' > out && cat out> es.html

rm out