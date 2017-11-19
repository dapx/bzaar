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
};