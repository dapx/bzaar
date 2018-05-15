import { Dimensions } from 'react-native';

export function getDeviceWidth(percentage = 100) {
  return (percentage * Dimensions.get('window').width) / 100;
}

export function getDeviceHeight(percentage = 100) {
  return (percentage * Dimensions.get('window').height) / 100;
}

const { width, height } = Dimensions.get('window');
const imageWidth = getDeviceWidth(100);
const imageHeight = getDeviceHeight(56);

export const lightboxStyle = { style: { width, height } };

export const product = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    margin: 10,
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    height,
  },
  carrousel: {
    width,
    height: imageHeight,
  },
  images: {
    width: imageWidth,
    height: imageHeight,
    alignSelf: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  currency: {
    flex: 1,
    justifyContent: 'center',
  },
  currencyText: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    padding: 11,
  },
  footerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'black',
  },
  footerButton: {
    flex: 1,
    alignSelf: 'center',
  },
  buyButton: {
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 5,
    padding: 10,
  },
  backButtonIcon: {
    color: '#000',
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  description: {
    flex: 2,
    padding: 10,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  info: {
    flex: 1,
    fontSize: 16,
  },
  sizesContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: 'transparent',
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  sizes: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'transparent',
  },
  size: {
    padding: 10,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 100,
    backgroundColor: 'white',
  },
};

export const stores = {
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  storeImage: {
    width: getDeviceWidth(49),
    height: getDeviceWidth(49),
  },
  storeUniqueImage: {
    width: getDeviceWidth(49),
    height: getDeviceWidth(49),
    alignSelf: 'center',
  },
  storeExtendedImage: {
    width: getDeviceWidth(100),
    height: getDeviceWidth(49),
  },
};

export const headers = {
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 5,
    padding: 8,
  },
  backButtonIcon: {
    color: '#000',
    fontSize: 24,
  },
  rightButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 50,
    padding: 8,
  },
};

export const storeEdit = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  carrousel: {
    width: 400,
    height: 300,
    alignSelf: 'center',
  },
  image: {
    width: 400,
    height: 300,
  },
};

export const store = {
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  storeImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
  },
};
