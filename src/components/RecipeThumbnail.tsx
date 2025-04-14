import { Image, ImageProps } from "expo-image";
import { Component } from "react";

export class RecipeThumbnail extends Component<ImageProps> {
  render() {
    const { source, ...props } = this.props;
    return <Image source={source} {...props} />;
  }
}
