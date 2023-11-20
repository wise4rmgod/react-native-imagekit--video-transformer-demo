import { StyleSheet, Text, View, TextInput, Pressable, Button, ScrollView } from "react-native";
import React, { useCallback } from 'react';
import { Video, ResizeMode } from 'expo-av';




const videoUrl = "https://ik.imagekit.io/rjxlixj7d/workers.mp4"
// This is utilities function we are going to use to generate the ImageKit transformation URL based on the base URL and transformation parameters
function generateImageKitTransformationURL (baseURL, transformationParams) {
  // Start with the base URL
  let imageURL = baseURL + '?';

  // Iterate through the transformation parameters
  for (const key in transformationParams) {
    if (transformationParams.hasOwnProperty(key)) {
      let delimater = '-'
      if (key === 'tr') delimater = '='
      // Append the parameter key and value to the URL
      imageURL += `${key}${delimater}${encodeURIComponent(transformationParams[key])},`;
    }
  }

  // Remove the trailing comma and return the final URL
  return imageURL.slice(0, -1);
}

export default function Page () {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [text, setText] = React.useState("We are going to have some food")
  const [computedUrl, setComputedUrl] = React.useState(videoUrl)

  const handlePlayAndPause = () => {
    if (status.isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
  }
  const addTextToVideo = useCallback(() => {
    // l-text is the transformation name for text overlay transformation
    // When composing the transformer parameters for our utility function, we need to ensure
    // that the first parameter is always the transformation name e.g. tr=l-text
    // followed by the actual transformation parameters and their values with the last parameter
    // being the closing parameter e.g. l-end
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-text',
      i: encodeURIComponent(text),
      fs: 'bh_div_20',
      w: 'bh_div_2',
      bg: 'yellow',
      pa: 'bw_mul_0.01',
      l: 'end',
    })
  }, [text])
  const addImageToVideo = useCallback(() => {
    // l-image is the transformation name for image overlay transformation
    const imageId = 'default-image.jpg'
    // https://ik.imagekit.io/demo/base-video.mp4?tr=l-image,i-logo.png,l-end
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-image',
      i: imageId,
      w: 'bh_div_2',
      l: 'end',
    })
  }, [])

  const addSubtitleToVideo = useCallback(() => {
    // l-subtitles is the transformation name for text subtitle transformation
    const subtitleId = 'worker-preview.srt'
    // https://ik.imagekit.io/demo/base-video.mp4?tr=l-subtitles,i-english.srt,l-end
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-subtitles',
      i: subtitleId,
      l: 'end',
    })
  }, [])

  const addVideoOverlayToVideo = useCallback(() => {
    // https://ik.imagekit.io/demo/base-video.mp4?tr=l-video,i-overlay.mp4,l-end
    const videoId = 'magnify.mp4'
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-video',
      i: videoId,
      l: 'end',
    })
  }, [])
  console.log(computedUrl);
  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <View style={ styles.main }>
        <Text style={ styles.title }>Hello World</Text>

        <View>
          <TextInput
            multiline
            numberOfLines={ 4 }
            placeholder="Enter your text here"
            style={ { padding: 10, borderColor: 'gray', borderWidth: 1 } }
            onChangeText={ text => setText(text) }
            value={ text }
          />
          <View style={ { paddingVertical: 16 } } >
            {/* 
              We are going to call the utility function to generate the transformation URL
              for the video with the text overlay transformation
             */}
            <Pressable onPress={ () => setComputedUrl(addTextToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Text Overlay to Video</Text>
            </Pressable>
            {/* 
              We are going to call the utility function to generate the transformation URL
              for the video with the image overlay transformation
             */}
            <Pressable onPress={ () => setComputedUrl(addImageToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Image Overlay to Video</Text>
            </Pressable>
            {/* 
              We are going to call the utility function to generate the transformation URL
              for the video with the text subtitle transformation
             */}
            <Pressable onPress={ () => setComputedUrl(addSubtitleToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Text Subtitle to Video</Text>
            </Pressable>
            {/* 
              We are going to call the utility function to generate the transformation URL
              for the video with the video overlay transformation
             */}
            <Pressable onPress={ () => setComputedUrl(addVideoOverlayToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Video Overlay to Video</Text>
            </Pressable>

          </View>

        </View>
        <View>
          <Video
            ref={ video }
            style={ styles.video }
            // Ensure that source uri is the computed URL
            source={ {
              uri: computedUrl
            } }
            useNativeControls
            resizeMode={ ResizeMode.CONTAIN }
            isLooping
            onPlaybackStatusUpdate={ status => setStatus(() => status) }
          />
          <View style={ styles.buttons }>
            <Button
              title={ status.isPlaying ? 'Pause' : 'Play' }
              onPress={ handlePlayAndPause }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  button: {
    marginVertical: 8,
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  }
});
