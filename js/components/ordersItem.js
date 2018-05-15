import React, { Component } from 'react';
import { TouchableOpacity, View, LayoutAnimation } from 'react-native';
import { Text, Button, Card } from 'native-base';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';
import { ApiUtils } from '../utils/api';

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
    flex: 1,
  },
};

// TODO - CRIAR FILTERS
const statusInfo = {
  1: 'Aguardando sua confirmação',
  2: 'Aguardando envio..',
  3: 'Aguardando recebimento',
};

const statusColor = {
  0: 'transparent',
  1: '#ddd',
  2: '#FFCA15',
  3: '#0DFF83',
  4: 'transparent',
  5: 'transparent',
};

const descButton = {
  0: '',
  1: 'Confirmar venda',
  2: 'Confirmar envio',
};

const descStatus = {
  3: 'Sendo enviado para ',
  4: 'Entregue para ',
  5: 'Cancelado pedido de ',
};

const CardStatus = ({ status, updatedAt }) => (status !== 0 && status !== 4 && status !== 5)
  && (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: statusColor[status] }}>
        <Text>{`${statusInfo[status]} - ${moment(updatedAt).fromNow()}`}</Text>
      </View>
    </View>
  );

CardStatus.propTypes = {
  status: PropTypes.number.isRequired,
  updatedAt: PropTypes.string,
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

const FooterStatusContent = ({
  status, username, onConfirm, onCancel, isLoading,
}) => {
  if (status === 0) {
    return (
      <Text>{`Sacola de ${username}`}</Text>
    );
  }
  if (status === 1) {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
        <Button
          onPress={onCancel}
          small
          danger
          disabled={isLoading}
        >
          <Text>Cancelar</Text>
        </Button>
        <Button
          onPress={onConfirm}
          small
          disabled={isLoading}
        >
          <Text>{descButton[status]}</Text>
        </Button>
      </View>
    );
  }
  if (status <= 2) {
    return (
      <Button
        onPress={onConfirm}
        small
        disabled={isLoading}
      >
        <Text>{descButton[status]}</Text>
      </Button>
    );
  }
  if (status <= 5) {
    return (<Text>{descStatus[status] + username}</Text>);
  }
  return (<Text>{'error'}</Text>);
};

FooterStatusContent.propTypes = {
  status: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const CardFooter = ({
  item,
  onConfirm,
  onCancel,
  isLoading,
}) => (
  <View style={styles.footer}>
    <View style={styles.totalContainer}>
      <View style={styles.buttonContainer}>
        <FooterStatusContent
          status={item.status}
          username={item.user_name}
          onConfirm={onConfirm}
          onCancel={onCancel}
          isLoading={isLoading}
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
    user_name: PropTypes.string.string,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
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
            Qtde: {props.item.quantity}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

CardBody.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  imageWidth: PropTypes.number.isRequired,
};

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
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
    this.setState({ isLoading: true });
    this.props.onConfirm(this.props.item)
      .then(() => this.setState({ isLoading: false }));
  }

  onCancel() {
    this.setState({ isLoading: true });
    this.props.onCancel(this.props.item)
      .then(() => this.setState({ isLoading: false }));
  }

  onRemove() {
    ApiUtils.success("It's not possible, sorry");
  }

  render() {
    const {
      item,
      imageWidth,
    } = this.props;
    return (
      <Card>
        <CardHeader
          item={item}
          onRemove={this.onRemove}
        />
        <CardStatus
          status={item.status}
          updatedAt={item.updated_at}
        />
        <CardBody
          item={item}
          imageWidth={imageWidth} />
        <CardFooter
          item={item}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          isLoading={this.state.isLoading}
        />
      </Card>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product_name: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
  imageWidth: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Item;
