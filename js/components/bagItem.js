import React, { Component } from 'react';
import { TouchableOpacity, View, LayoutAnimation } from 'react-native';
import { Text, Button, Card } from 'native-base';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

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
      <Button
        onPress={onConfirm}
        small
        dark
        danger={(status === 1)}
      >
        <Text>{descButton[status]}</Text>
      </Button>
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

class BagItem extends Component {
  constructor(props) {
    super(props);
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
    this.props.onConfirm(this.props.item);
  }

  render() {
    const {
      item,
      onRemove,
      imageWidth,
    } = this.props;
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
          imageWidth={imageWidth} />
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
  imageWidth: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default BagItem;
