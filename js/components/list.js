import React from 'react';
import { FlatList, Animated } from 'react-native';
import PropTypes from 'prop-types';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  keyExtractor(item) { return `${item.id}`; }

  onPress(item) {
    const { onPressItem } = this.props;
    onPressItem(item);
  }

  renderItem({ item }) {
    const { ListItem } = this.props;
    return (
      <ListItem
        key={`item-${item.id}`}
        item={item}
        onPressItem={this.onPress}
      />
    );
  }

  render() {
    const {
      data,
      refreshing,
      onRefresh,
      ListEmptyComponent,
      scrollEventThrottle,
      scrollY,
    } = this.props;
    return (
      <AnimatedFlatList
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={{ backgroundColor: 'white' }}
        numColumns={2}
        horizontal={false}
        data={data.length > 0 ? data : null}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={scrollEventThrottle || 0}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollY } } },
        ], { useNativeDriver: true })}
      />
    );
  }
}

List.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  refreshing: PropTypes.bool.isRequired,
  ListItem: PropTypes.func.isRequired,
  ListEmptyComponent: PropTypes.element.isRequired,
  onPressItem: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  scrollEventThrottle: PropTypes.number,
  scrollY: PropTypes.object,
};

export default List;
