import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { ScrollView as VirtualizedScrollView } from "react-native-virtualized-view";
import { Card, Image, Icon, Rating } from "react-native-elements";
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
        <VirtualizedScrollView>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.toggleModal()}
          />
          <RenderComments comments={comments} />
        </VirtualizedScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Your Comment</Text>
                <Icon
                  name="close"
                  type="font-awesome"
                  color="#fff"
                  size={24}
                  onPress={() => this.toggleModal()}
                  containerStyle={styles.closeIcon}
                />
              </View>
              
              <ScrollView 
                style={styles.modalContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                <View style={styles.ratingSection}>
                  <Text style={styles.sectionLabel}>Your Rating</Text>
                  <Rating
                    showRating
                    ratingCount={5}
                    minValue={1}
                    startingValue={this.state.rating}
                    onFinishRating={(rating) => this.setState({ rating: rating })}
                    style={styles.ratingComponent}
                    ratingBackgroundColor="#f0f0f0"
                  />
                  <Text style={styles.ratingText}>
                    {this.state.rating} {this.state.rating === 1 ? 'Star' : 'Stars'} Selected
                  </Text>
                </View>
                
                <View style={styles.inputSection}>
                  <Text style={styles.sectionLabel}>Your Name</Text>
                  <View style={styles.textInputWrapper}>
                    <Icon
                      name="user-o"
                      type="font-awesome"
                      color="#512DA8"
                      size={20}
                      containerStyle={styles.textInputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your name"
                      placeholderTextColor="#999"
                      onChangeText={(value) => this.setState({ author: value })}
                      value={this.state.author}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </View>
                </View>
                
                <View style={styles.inputSection}>
                  <Text style={styles.sectionLabel}>Your Comment</Text>
                  <View style={[styles.textInputWrapper, styles.textAreaWrapper]}>
                    <Icon
                      name="comment-o"
                      type="font-awesome"
                      color="#512DA8"
                      size={20}
                      containerStyle={styles.textInputIcon}
                    />
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Share your thoughts about this dish..."
                      placeholderTextColor="#999"
                      onChangeText={(value) => this.setState({ comment: value })}
                      value={this.state.comment}
                      multiline
                      numberOfLines={4}
                      returnKeyType="done"
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => this.toggleModal()}
                  >
                    <Icon
                      name="times"
                      type="font-awesome"
                      color="#666"
                      size={18}
                      containerStyle={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.button, styles.buttonSubmit]}
                    onPress={() => this.handleComment(dishId)}
                  >
                    <Icon
                      name="check"
                      type="font-awesome"
                      color="#fff"
                      size={18}
                      containerStyle={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextSubmit}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </React.Fragment>
    );
  }
  
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    backgroundColor: '#512DA8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeIcon: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  ratingSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  ratingComponent: {
    paddingVertical: 15,
  },
  ratingText: {
    fontSize: 16,
    color: '#512DA8',
    marginTop: 10,
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    minHeight: 50,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    minHeight: 100,
    paddingVertical: 10,
  },
  textInputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputInnerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonSubmit: {
    backgroundColor: '#512DA8',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  buttonTextSubmit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);