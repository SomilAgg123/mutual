import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
const backArrow = <Feather name="arrow-left" size={30} color="black" />;
const MUTUAL_PURPLE = "#883FCE";

const del = require('../../../assets/graphics/delete.png');

export default function AccountManagement({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            {backArrow}
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Help Center</Text>
                    </View>
                </View>
                <ScrollView>
                    <Text style={styles.header}>Mutual Privacy Policy and Data Usage Guidelines</Text>
                    <Text style={styles.paragraph}>
                        At Mutual, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your information, and your rights and choices regarding your personal information. By using Mutual, you agree to the collection and use of your information in accordance with this policy.
                    </Text>
                    <Text style={[styles.header, {
                        fontSize: 16
                    }]}>
                        Information We Collect
                    </Text>
                    <Text style={styles.paragraph}>
                        We collect information you provide to us when you create an account, including your name, email address, profile information, and preferences. We also collect information about your usage of the app, such as your matches, messages, and interactions with other users. We use this information to provide and improve the app's features and services.
                    </Text>
                    <Text style={[styles.header, {
                        fontSize: 16
                    }]}>
                        Sharing Your Information
                    </Text>
                    <Text style={styles.paragraph}>
                    We may share your information with third-party service providers who assist us in providing the app's services, such as analytics and advertising tools. We require these providers to provide the same level of protection for your data as stated in this Privacy Policy.
                    </Text>
                    <Text style={[styles.header, {
                        fontSize: 16
                    }]}>
                        Data Retention & Deletion
                    </Text>
                    <Text style={styles.paragraph}>
                    We retain your information as long as necessary to provide you with the app's services and as required by applicable laws. You have the right to revoke your consent and request deletion of your data at any time. We will promptly delete your data upon request, except to the extent we are required to retain it to comply with our legal obligations. To request the revocation of your consent and deletion of your data, please send an email to demo@example.com.
                    </Text>
                    <Text style={[styles.header, {
                        fontSize: 16
                    }]}>
                        Contact Usage
                    </Text>
                    <Text style={styles.paragraph}>
                    We will not contact people using information collected via a user's Contacts or Photos unless the user explicitly initiates this on an individualized basis. We will not include a Select All option or default the selection of all contacts. We will provide the user with a clear description of how the message will appear to the recipient before sending it.
                    </Text>
                    <Text style={styles.paragraph}>
                    By using Mutual, you acknowledge that you have read this Privacy Policy and agree to the collection and use of your information in accordance with this policy. If you have any questions or concerns about our Privacy Policy, please contact us at demo@example.com.

                    </Text>
                </ScrollView>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE'
    },
    subContainer: {
        flex: 1,
        marginTop: '18%',
        paddingHorizontal: '5%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '5%'
    },
    // text
    headerText: {
        marginLeft: '3%',
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    header: {
        marginTop: '5%',
        fontFamily: 'LatoBold',
        fontSize: 24
    },
    paragraph: {
        marginTop: '5%',
        fontFamily: 'Lato',
        fontSize: 18,
        lineHeight: 24
    },
    editText: {
        fontFamily: 'Lato',
        color: MUTUAL_PURPLE
    }
});