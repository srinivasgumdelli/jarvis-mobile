import React, { Component } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

const WEATHER_URL_BASE = "http://api.openweathermap.org/data/2.5/weather?zip=07030&units=imperial&appid=";
const WEMO_URL = "WEMO_SERVER_URL";
const { width, height } = Dimensions.get('window');

function home_automation():React.Component {
    class Root extends Component {
        constructor(){
            super();
            this.state = {
                appState: 'initial',
                openWeatherKey: 'OPEN_WEATHER_API_KEY',
            }
        }
        componentDidMount() {
            this.getTemperature();
        }

        getTemperature() {
            fetch(WEATHER_URL_BASE + this.state.openWeatherKey)
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({
                        temperatureData : responseData
                    })
                });

            fetch(WEMO_URL + 'environment')
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({
                        switches: responseData,
                        appState: 'loaded'
                    })
                });
        }

        styleTemperature(tempData) {
            const temp = tempData.main.temp;
            const temp_min = tempData.main.temp_min;
            const temp_max = tempData.main.temp_max;
            return (
                <View style={styles.TemperatureRow}>
                    <Text style={styles.TemperatureCurrent}>
                        {temp}˚
                    </Text>
                    <Text style={styles.TemperatureMinMax}>
                        Min: {temp_min}˚   |   Max: {temp_max}˚
                    </Text>
                </View>
            );
        }

        styleWemo() {
            if (this.state.appState === 'initial') {
                return (
                    <View>
                        <Text>
                            Loading, please wait
                        </Text>
                    </View>
                );
            } else {
                var buttons = [];
                var switchesData = this.state.switches;
                Object.keys(switchesData).map(function (_switch) {
                    buttons.push(
                        <TouchableOpacity
                            onPress={
                                () => {
                                    var URL = WEMO_URL + 'device/' + _switch;
                                    fetch(URL, {
                                        method: 'POST'
                                    }).then();
                                }
                            }
                            style={styles.WemoButton}
                            key={_switch}
                        >
                            <Text style={styles.WemoButtonText}>
                                {_switch}
                            </Text>
                        </TouchableOpacity>
                    )

                });
                return (
                    <View style={styles.WemoRow}>
                        {buttons}
                    </View>
                );
            }
        }

        styleUI() {
            return (
                <View style={styles.container}>
                    <View style={styles.TemperatureContainer}>
                        {this.styleTemperature(this.state.temperatureData)}
                    </View>
                    <View style={styles.WemoContainer}>
                        {this.styleWemo()}
                    </View>
                </View>
            );
        }

        render() {
            if(this.state.appState ==='initial') {
                return (
                    <View style={styles.TemperatureContainer}>
                        <Text>
                            Loading, please wait
                        </Text>
                    </View>
                );
            } else {
                return this.styleUI();
            }
        }
    }
    return Root;
}

const styles = StyleSheet.create({
    TemperatureContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'purple',
        height:170,
        paddingTop:15,
        paddingBottom: 15
    },
    TemperatureRow: {
        // height: 100,
    },
    WemoRow: {
        // height: 100,
    },
    WemoButton: {
        backgroundColor: 'green',
        alignSelf: 'stretch',
        alignItems: 'center',
        height:75,
        width: width-30,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 25,
        paddingBottom: 35,
        marginBottom:5
    },
    WemoButtonText: {
        fontSize: 20,
        color: 'white',
    },
    TemperatureCurrent: {
        fontSize: 80,
        color: 'white',
    },
    TemperatureMinMax: {
        fontSize: 20,
        color: 'white',
    },
    WemoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderColor:'green',
        borderWidth: 1,
        height:270,
        paddingTop:15,
        paddingBottom: 15
    },
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default home_automation;