import sys
import json
import numpy as np
import tensorflow as tf # We still need tensorflow, but only for the 'lite' interpreter

def predict_disease(image_path):
    """
    Loads a lightweight .tflite model and predicts disease.
    """
    try:
        # 1. Load the TFLite model and allocate tensors. This is much faster.
        interpreter = tf.lite.Interpreter(model_path='model/model.tflite')
        interpreter.allocate_tensors()

        # 2. Get input and output details.
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # 3. Load the class names.
        with open('model/class_names.json', 'r') as f:
            class_names = json.load(f)

        # 4. Load and preprocess the image.
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(128, 128))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_batch = np.expand_dims(img_array, axis=0).astype(np.float32)

        # 5. Set the image as input to the model.
        interpreter.set_tensor(input_details[0]['index'], img_batch)

        # 6. Run the prediction.
        interpreter.invoke()

        # 7. Get the result.
        predictions = interpreter.get_tensor(output_details[0]['index'])
        
        predicted_class_index = np.argmax(predictions[0])
        predicted_class_name = class_names[predicted_class_index]
        
        # 8. Print the final result.
        print(predicted_class_name)

    except Exception as e:
        print(f"ERROR in Python script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        image_file_path = sys.argv[1]
        predict_disease(image_file_path)
    else:
        print("Error: Image path not provided.", file=sys.stderr)
        sys.exit(1)
