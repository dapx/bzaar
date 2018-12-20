import React, { Component } from 'react';
import { TouchableOpacity, View, LayoutAnimation } from 'react-native';
import { Text, Card } from 'native-base';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Button from './button';
import CardStatus from './card/CardStatus';
import FooterButton from './card/FooterButton';

const styles = {
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    padding: 5,
  },
  titleContainer: {
    flex: 8,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  close: {
    flex: 1,
    justifyContent: 'center',
    padding: 3,
  },
  closeText: {
    textAlign: 'center',
  },
  bodyTextContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 18,
    textAlign: 'left',
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    padding: 5,
  },
  totalInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  totalInfoText: {
    fontSize: 16,
    textAlign: 'left',
  },
  buttonContainer: {
  },
};

const statusColor = {
  0: 'transparent',
  1: '#ddd',
  2: '#FFCA15',
  3: '#0DFF83',
  4: '#0DFF83',
  5: '#ddd',
  6: '#FFCA15',
};

const statusInfo = {
  0: '',
  1: 'Aguardando confirmação da Loja',
  2: 'Venda Confirmada, aguarde o envio',
  3: 'Produto em trânsito',
  4: 'Produto entregue!',
  5: 'Compra cancelada pela loja!',
  6: 'Aguardando você buscar o produto!',
};

const mustShow = status => status !== 0 && status !== 4 && status !== 5;

class Tag extends React.PureComponent {
  onPress = () => {
    const { id } = this.props;
    this.props.onPress(id);
  }

  render() {
    const { name, isSelected } = this.props;
    const selectedStyle = isSelected ? { backgroundColor: '#ddd' } : {};
    return (
      <Button
        onPress={this.onPress}
        style={[
          {
            margin: 2,
            padding: 5,
            borderRadius: 10,
            borderColor: '#ddd',
            borderWidth: 0.5,
          },
          selectedStyle,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text>{name}</Text>
        </View>
      </Button>
    );
  }
}

Tag.propTypes = {
  onPress: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

class Addresses extends React.PureComponent {
  render() {
    const {
      status,
      addresses,
      style,
      onPress,
      selectedId,
    } = this.props;
    if (status === 0) {
      const list = addresses.map(a => (
        <Tag
          key={`address_${a.id}`}
          id={a.id}
          name={a.name}
          isSelected={(a.id === selectedId)}
          onPress={onPress}
        />
      ));
      return (
        <View style={style}>
          { list }
          <Tag
            key={`address_${0}`}
            id={0}
            name={'Buscar na loja'}
            isSelected={(selectedId === 0)}
            onPress={onPress}
          />
        </View>
      );
    }
    return null;
  }
}

Addresses.propTypes = {
  status: PropTypes.number.isRequired,
  selectedId: PropTypes.number.isRequired,
  addresses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
};

const CardHeader = props => (
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <Text
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={styles.title}
      >
        {props.item.product_name}
      </Text>
    </View>
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.close}
        onPress={props.onRemove}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
);

CardHeader.propTypes = {
  item: PropTypes.shape({
    product_name: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

const descButton = {
  0: 'Pedir',
  1: 'Cancelar',
  2: '',
  3: 'Finalizar',
  4: '',
  5: '',
  6: 'Finalizar',
};

const mustShowButton = status => status <= 1 || status === 3 || status === 6;
const isCancelButton = status => status === 1;

const CardFooter = ({
  item, onConfirm,
}) => (
  <View style={styles.footer}>
    <View style={styles.totalContainer}>
      <View style={styles.totalInfo}>
        <Text
          style={styles.totalInfoText}
        >
          Qtde.Total: {item.quantity}
        </Text>
        <Text
          style={styles.totalInfoText}
        >
          Total R$: {item.product_price}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <FooterButton
          description={descButton[item.status]}
          onConfirm={onConfirm}
          isHide={!mustShowButton(item.status)}
          isCancel={isCancelButton(item.status)}
        />
      </View>
    </View>
  </View>
);

CardFooter.propTypes = {
  item: PropTypes.shape({
    status: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product_price: PropTypes.number.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const CardBody = props => (
  <View style={{ flex: 1 }}>
    <View style={{
      flex: 1,
      flexDirection: 'row',
      margin: 5,
      marginLeft: 10,
    }}
    >
      <View style={{ flex: 1 }}>
        <FastImage source={{ uri: props.item.product_image }}
          style={{ height: props.imageWidth, width: props.imageWidth }}
        />
      </View>
      <View style={{
        flex: 2,
      }}>
        <View style={styles.bodyTextContainer}>
          <Text style={styles.bodyText}>
            Preço: R$ {props.item.product_price}
          </Text>
          <Text style={styles.bodyText}>
            Qtde. Disponível: {props.item.quantity}
          </Text>
        </View>
      </View>
    </View>
    <Addresses
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderColor: '#ddd',
        borderWidth: 0.5,
        borderRadius: 10,
        margin: 5,
      }}
      status={props.item.status}
      addresses={props.addresses}
      selectedId={props.selectedId}
      onPress={props.onPress}
    />
  </View>
);

CardBody.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
  selectedId: PropTypes.number,
  addresses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  imageWidth: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

class BagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 0,
    };
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentDidMount() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 250,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    });
  }

  onConfirm() {
    const { selectedId } = this.state;
    if (selectedId === 0) {
      this.props.onConfirm(this.props.item, null);
      return;
    }
    const address = this.props.addresses.find(a => a.id === this.state.selectedId);
    this.props.onConfirm(this.props.item, address);
  }

  onPress = (selectedId) => {
    this.setState({ selectedId });
  }

  render() {
    const {
      item,
      onRemove,
      imageWidth,
      addresses,
    } = this.props;
    const { selectedId } = this.state;
    return (
      <Card>
        <CardHeader
          item={item}
          onRemove={onRemove}
        />
        <CardStatus
          status={statusInfo[item.status]}
          color={statusColor[item.status]}
          isHide={!mustShow(item.status)}
          updatedAt={item.updated_at}
        />
        <CardBody
          item={item}
          imageWidth={imageWidth}
          addresses={addresses}
          selectedId={selectedId}
          onPress={this.onPress}
        />
        <CardFooter
          item={item}
          onConfirm={this.onConfirm}
        />
      </Card>
    );
  }
}

BagItem.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product_name: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
  addresses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  imageWidth: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default BagItem;
