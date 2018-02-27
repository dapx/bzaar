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

export const storeEdit = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  carrousel: {
    width: 400,
    height: 400,
    alignSelf: 'center',
  },
  image: {
    width: 400,
    height: 400,
  },
  imagesEdit: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.8,
    borderRadius: 50,
    padding: 5,
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
