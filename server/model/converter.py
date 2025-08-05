import tensorflow as tf

try:
    print("Loading the full Keras model...")
    # Load your existing, trained Keras model
    model = tf.keras.models.load_model('model/trained_plant_disease_model.keras')

    # Create a TensorFlow Lite converter object
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    print("Converting the model to TensorFlow Lite format...")
    # Perform the conversion
    tflite_model = converter.convert()

    print("Saving the new .tflite model...")
    # Save the new, lightweight model to a file
    with open('model/model.tflite', 'wb') as f:
        f.write(tflite_model)

    print("\nSUCCESS! Your new 'model.tflite' file has been created in the server/model/ directory.")

except Exception as e:
    print(f"\nAN ERROR OCCURRED: {e}")