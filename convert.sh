#!/bin/sh
rm -rf model
tensorflowjs_converter --input_format keras --output_format tensorflowjs "$1" model   