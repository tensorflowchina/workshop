@echo off
echo "This script is for Windows user only"

echo "Installing dependencies"
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

echo "Copying mnist dataset to %USERPROFILE\.keras\datasets"
mkdir %USERPROFILE%\.keras\datasets
copy py\mnist.npz %USERPROFILE%\.keras\datasets

echo "Done"
