import { Dimensions } from 'react-native';

export function getDeviceWidth(percentage = 100) {
  return (percentage * Dimensions.get('window').width) / 100;
}

export function getDeviceHeight(percentage = 100) {
  return (percentage * Dimensions.get('window').height) / 100;
}

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
    resizeMode: 'cover',
  },
  storeUniqueImage: {
    width: getDeviceWidth(49),
    height: getDeviceWidth(49),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  storeExtendedImage: {
    width: getDeviceWidth(100),
    height: getDeviceWidth(49),
  },
};

export const storeEdit = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: getDeviceWidth(50),
    height: getDeviceWidth(50),
    resizeMode: 'cover',
    alignSelf: 'center',
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
    resizeMode: 'contain',
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
};
