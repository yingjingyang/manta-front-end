How to run tests:

dolphin-config.json is your polkadot launch config change "bin"s to binary files location. You can download polkadot binary from a release instead of building the whole thing. You will need to build Manta and target that binary. Please use full paths aka ~/home/user/Manta/target/release/... (just an example)

in the tests folder there is a test_config.env, do not change the format, you can type in the versions/tags/branch you want the test to checkout and use.

you run the test by running 

./run_tests.sh -plc=( dolphin-config.json path ) -uip=(front-end path) -sp=(signer path) -np=(manta path)

example:
./run_tests.sh -plc=dolphin-config.json -uip=${{ github.workspace }}/manta-front-end -sp=${{ github.workspace }}/manta-signer -np=${{ github.workspace }}/manta
