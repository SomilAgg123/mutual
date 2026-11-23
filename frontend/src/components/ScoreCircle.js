import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ScoreCirlce({ title, percent, textShown, color, size }) {
    const propStyle = (percent, base_degrees) => {
        const rotateBy = base_degrees + (percent * 3.6);
        return {
            transform:[{rotateZ: `${rotateBy}deg`}]
        };
    }

    const renderThirdLayer = (percent) => {
        if(percent > 50)
        {
            return <View style={[styles.secondProgressLayer,propStyle((percent - 50), 45), {
                borderRightColor: color,
                borderTopColor: color,
                width: size,
                height: size,
            }]}></View>
        }
        else
        {
            return <View style={[styles.offsetLayer, {
                width: size,
                height: size,
            }]}></View>
        }
    }


    let firstProgressLayerStyle;
    if (percent > 50)
    {
        firstProgressLayerStyle = propStyle(50, -135);
    } else {
        firstProgressLayerStyle = propStyle(percent, -135)
    }

    return (
        <View style={styles.container}>
            <View style={[styles.circle, {
                width: size,
                height: size,
            }]}>
                <View style={[styles.firstProgressLayer, firstProgressLayerStyle, {
                    borderRightColor: color,
                    borderTopColor: color,
                    width: size,
                    height: size,
                }]}></View>
                {renderThirdLayer(percent)}
                <Text style={styles.displayNumber}>{percent}</Text>
            </View>
            {textShown ? <Text style={styles.displayText}>{title+"\n"}</Text> : null}
        </View>
    )
}

const circleSize = 60;
const borderThickness = 6;
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    circle: {
        width: circleSize,
        height: circleSize,
        borderWidth: borderThickness,
        borderRadius: 100,
        borderColor: '#EDEDED',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    firstProgressLayer: {
        width: circleSize,
        height: circleSize,
        borderWidth: borderThickness,
        borderRadius: 100,
        position: 'absolute',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#883FCE',
        borderTopColor: '#883FCE',
        transform:[{rotateZ: '-135deg'}]
    },
    secondProgressLayer:{
        width: circleSize,
        height: circleSize,
        position: 'absolute',
        borderWidth: borderThickness,
        borderRadius: 100,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#883FCE',
        borderTopColor: '#883FCE',
        transform: [{rotateZ: '45deg'}]
    },
    offsetLayer: {
        width: circleSize,
        height: circleSize,
        borderWidth: borderThickness,
        borderRadius: 100,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#EDEDED',
        borderTopColor: '#EDEDED',
        transform:[{rotateZ: '-135deg'}]
    },
    displayText: {
        flex: 1,
        fontFamily: 'LatoBold',
        fontSize: 18,
        textAlign: 'center'
    },
    displayNumber: {
        fontFamily: 'Lato',
        position: 'absolute',
        fontSize: 20,
        textAlign: 'center'
    }
});
