import React, { useRef } from "react";
import { View, Button, StyleSheet, Alert, TextInput, Modal, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function WebviewEditor() {
  const webviewRef = useRef<WebView>(null);

  const [tableModalVisible, setTableModalVisible] = React.useState(false);
  const [rows, setRows] = React.useState("2");
  const [cols, setCols] = React.useState("2");

  const [imageModalVisible, setImageModalVisible] = React.useState(false);
  const [imgWidth, setImgWidth] = React.useState("200");
  const [imgHeight, setImgHeight] = React.useState("200");

  const injectedJS = `
    document.addEventListener("message", function(event) {
      if(event.data.startsWith("insertTable:")) {
        const params = event.data.replace("insertTable:","").split(",");
        const rows = parseInt(params[0]);
        const cols = parseInt(params[1]);
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        for(let r=0; r<rows; r++){
          tableHTML += '<tr>';
          for(let c=0; c<cols; c++){
            tableHTML += '<td>&nbsp;</td>';
          }
          tableHTML += '</tr>';
        }
        tableHTML += '</table><br/>';
        quill.clipboard.dangerouslyPasteHTML(quill.getSelection().index, tableHTML);
      }
      else if(event.data.startsWith("insertImage:")) {
        const params = event.data.replace("insertImage:","").split(",");
        const url = params[0];
        const width = params[1];
        const height = params[2];
        const imgHTML = '<img src="'+url+'" width="'+width+'" height="'+height+'"/><br/>';
        quill.clipboard.dangerouslyPasteHTML(quill.getSelection().index, imgHTML);
      }
      else if(event.data === "getHTML") {
        window.ReactNativeWebView.postMessage(quill.root.innerHTML);
      }
    });
  `;

  const handleSave = () => {
    webviewRef.current?.postMessage("getHTML");
  };

  const insertTable = () => {
    setTableModalVisible(false);
    webviewRef.current?.postMessage(`insertTable:${rows},${cols}`);
  };

  const insertImage = () => {
    setImageModalVisible(false);
    const randomUrl = `https://placekitten.com/${imgWidth}/${imgHeight}`;
    webviewRef.current?.postMessage(`insertImage:${randomUrl},${imgWidth},${imgHeight}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
              </head>
              <body>
                <div id="editor" style="height:100%;"></div>
                <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
                <script>
                  var quill = new Quill('#editor', {
                    theme: 'snow',
                    modules: {
                      toolbar: [
                        ['undo','redo'],
                        ['bold', 'italic', 'underline'],
                        [{ 'font': [] }, { 'size': [] }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean'],
                        [{ 'table': 'insert' }]
                      ]
                    }
                  });
                </script>
              </body>
            </html>
          `,
        }}
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          console.log("HTML content:", event.nativeEvent.data);
        }}
      />

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 8 }}>
        <Button title="Insert Table" onPress={() => setTableModalVisible(true)} />
        <Button title="Insert Image" onPress={() => setImageModalVisible(true)} />
        <Button title="Save Content" onPress={handleSave} />
      </View>

      {/* Table Modal */}
      <Modal transparent visible={tableModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text>Enter rows and columns</Text>
            <TextInput keyboardType="numeric" placeholder="Rows" value={rows} onChangeText={setRows} style={styles.input} />
            <TextInput keyboardType="numeric" placeholder="Columns" value={cols} onChangeText={setCols} style={styles.input} />
            <Button title="Insert Table" onPress={insertTable} />
            <Button title="Cancel" onPress={() => setTableModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
      <Modal transparent visible={imageModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text>Enter image width and height</Text>
            <TextInput keyboardType="numeric" placeholder="Width" value={imgWidth} onChangeText={setImgWidth} style={styles.input} />
            <TextInput keyboardType="numeric" placeholder="Height" value={imgHeight} onChangeText={setImgHeight} style={styles.input} />
            <Button title="Insert Image" onPress={insertImage} />
            <Button title="Cancel" onPress={() => setImageModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"rgba(0,0,0,0.5)"
  },
  modalBox: {
    width:300,
    padding:20,
    backgroundColor:"white",
    borderRadius:10
  },
  input: {
    borderWidth:1,
    borderColor:"#ccc",
    padding:5,
    marginVertical:5,
    borderRadius:5
  }
});
