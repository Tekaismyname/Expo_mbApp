import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Card, Image, Icon, Rating, Input } from "react-native-elements";
import { baseUrl } from "../shared/baseUrl";

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    
    // Sắp xếp comment mới nhất lên đầu (theo date giảm dần)
    const sortedComments = [...comments].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList
          data={sortedComments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    );
  }
  // Format date từ ISO sang dạng dễ đọc
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }

  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating
          imageSize={12}
          readonly
          startingValue={item.rating}
          style={{ alignItems: "flex-start", paddingVertical: 5 }}
        />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + this.formatDate(item.date)}
        </Text>
      </View>
    );
  }
}

class RenderDish extends Component {
  render() {
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card>
          <Image
            source={{ uri: baseUrl + dish.image }}
            style={{
              width: "100%",
              height: 100,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Icon
              raised
              reverse
              type="font-awesome"
              color="#f50"
              name={this.props.favorite ? "heart" : "heart-o"}
              onPress={() =>
                this.props.favorite
                  ? alert("Already favorite")
                  : this.props.onPressFavorite()
              }
            />
            <Icon
              raised
              reverse
              type="font-awesome"
              color="#512DA8"
              name="pencil"
              onPress={() => this.props.onPressComment()}
            />
          </View>
        </Card>
      );
    }
    return <View />;
  }
}

// redux
import { connect } from "react-redux";
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

import { postFavorite, postComment } from "../redux/ActionCreators";
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 3, // Bắt đầu với 3 sao thay vì 5
      author: "",
      comment: "",
      showModal: false,
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  // Reset form về giá trị mặc định
  resetForm() {
    this.setState({
      rating: 3,
      author: "",
      comment: "",
    });
  }

  handleComment(dishId) {
    // Validation: Kiểm tra rating phải từ 1-5
    if (this.state.rating < 1 || this.state.rating > 5) {
      Alert.alert(
        'Invalid Rating',
        'Please select a rating between 1 and 5 stars.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation: Kiểm tra author không để trống
    if (this.state.author.trim() === '') {
      Alert.alert(
        'Missing Author',
        'Please enter your name.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation: Kiểm tra comment không để trống
    if (this.state.comment.trim() === '') {
      Alert.alert(
        'Missing Comment',
        'Please enter your comment.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Dispatch action để thêm comment
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    
    // Reset form trước
    this.resetForm();
    
    // Sau đó đóng modal
    this.toggleModal();
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter(
      (cmt) => cmt.dishId === dishId
    );
    const favorite = this.props.favorites.some((el) => el === dishId);

    return (
      <React.Fragment>
        <ScrollView>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.toggleModal()}
          />
          <RenderComments comments={comments} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Your Comment</Text>
            
            <Rating
              showRating
              ratingCount={5}
              minValue={1}
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            
            <Text style={styles.ratingText}>
              Selected: {this.state.rating} {this.state.rating === 1 ? 'star' : 'stars'}
            </Text>
            
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={(value) => this.setState({ author: value })}
              value={this.state.author}
              containerStyle={styles.formInput}
            />
            
            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              onChangeText={(value) => this.setState({ comment: value })}
              value={this.state.comment}
              containerStyle={styles.formInput}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButton}>
              <Button
                onPress={() => this.handleComment(dishId)}
                color="#512DA8"
                title="Submit"
              />
            </View>
            
            <View style={styles.modalButton}>
              <Button
                onPress={() => this.toggleModal()}
                color="gray"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
  
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20,
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
    padding: 10
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#512DA8',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  formInput: {
    marginBottom: 10,
  },
  modalButton: {
    marginVertical: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);