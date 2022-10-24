
# Argument Parsing

# -e= path to extension folder (chrome(github cloned and build)/ firefox XPI)

for i in "$@"; do
  case $i in
    #polkadot launch config/genesis
    -plc=*|--pl_config=*)
      PLCONFIG="${i#*=}"
      shift # past argument=value
      ;;
    -uip=*|--ui_path=*)
      UIPATH="${i#*=}"
      shift # past argument=value
      ;;
    -sp=*|--signer_path=*)
      BACKENDPATH="${i#*=}"
      shift # past argument=value
      ;;
    -np=*|--nodd_path=*)
      MANTA="${i#*=}"
      shift # past argument=value
      ;;
    -*|--*)
      echo "Unknown option $i"
      exit 1
      ;;
    *)
      ;;
  esac
done

# save current directory for running at the end
SELENIUM_TESTS_DIR=$(pwd)

# out from selenium tests
cd ..
TESTS_DIR=$(pwd)
# check if extension has been checked out and if it doesnt execute second command
[ ! -d "extension" ] && git clone https://github.com/polkadot-js/extension.git
cd extension
# build chrome extension
#yarn
#yarn install
#yarn build
# Firefox extension is downloaded through javascript

#Build manta
cd ${MANTA}
cargo install
cargo b -r

# build and start dolphin / signer/ front end
cd ${BACKENDPATH}/ui
source ~/.nvm/nvm.sh
nvm install 16.0.0
cargo tauri build
# fail bash on error, dont do on tauri build because of the appindicator
set -e

cd ../examples
ls --all
gnome-terminal -- cargo run --example test_server --features=unsafe-disable-cors --release
echo "STARTED SIGNER TEST SERVER"
cd ${UIPATH}/application

yarn
gnome-terminal -- yarn selenium-test

# go back to selenium so the logs are created there
cd ${SELENIUM_TESTS_DIR}
gnome-terminal -- polkadot-launch $PLCONFIG

#sleep to make sure everything is inialized and running before we run the test
sleep 60

cd ${SELENIUM_TESTS_DIR}
yarn
yarn prepare
yarn runtest

