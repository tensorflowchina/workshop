#!/bin/sh
echo "This script is for Linux user only"

echo "Installing dependencies"
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

echo "Copying mnist dataset to ~/.keras/datasets/"
echo "For windows user, please copy py/mnist.npz to %USERPROFILE%/.keras/datasets/"
mkdir -p ~/.keras/datasets/ && cp py/mnist.npz ~/.keras/datasets/

echo "Done"