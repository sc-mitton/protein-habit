import { Image, ImageProps } from "expo-image";
import { Component } from "react";

const CLOUDFRONT_DISTRIBUTION = "https://d3qrthqog6755h.cloudfront.net/";

export class RecipeThumbnail extends Component<ImageProps> {
  render() {
    const { source, ...props } = this.props;
    const uri = CLOUDFRONT_DISTRIBUTION + source?.uri;
    return <Image source={{ uri }} {...props} />;
  }
}
