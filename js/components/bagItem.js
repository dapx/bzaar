import React, { Component } from 'react';
import { TouchableOpacity, View, LayoutAnimation } from 'react-native';
import { Text, Button as NBButton, Card } from 'native-base';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';
import Button from './button';

moment.locale('pt-br');

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
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
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

const statusInfo = {
  0: '',
  1: 'Aguardando confirmação da Loja',
  2: 'Venda Confirmada, aguarde o envio',
  3: 'Produto em trânsito',
  4: 'Produto entregue!',
  5: 'Compra cancelada pela loja!',
};

const statusColor = {
  0: 'transparent',
  1: '#ddd',
  2: '#FFCA15',
  3: '#0DFF83',
  4: '#0DFF83',
  5: '#ddd',
};

const CardStatus = ({ status, updatedAt }) => (
  <View style={{ flex: 1 }}>
      { !!status &&
        <View style={{ backgroundColor: statusColor[status] }}>
          <Text>{`${statusInfo[status]} - ${moment(updatedAt).fromNow()}`}</Text>
        </View>
      }
  </View>
);

CardStatus.propTypes = {
  status: PropTypes.number.isRequired,
  updatedAt: PropTypes.string,
};

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
  3: 'Confirmar Entrega',
  4: '',
  5: '',
};

const FooterStatusContent = ({
  status, onConfirm,
}) => {
  if (status <= 1 || status === 3) {
    return (
      <NBButton
        onPress={onConfirm}
        small
        dark
        danger={(status === 1)}
      >
        <Text>{descButton[status]}</Text>
      </NBButton>
    );
  }
  return null;
};

FooterStatusContent.propTypes = {
  status: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

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
        <FooterStatusContent
          status={item.status}
          onConfirm={onConfirm}
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
          status={item.status}
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
