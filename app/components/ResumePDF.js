// components/ResumePDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    section: {
        marginBottom: 10
    },
    header: {
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5
    },
    contactInfo: {
        fontSize: 10,
        marginBottom: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2
    },
    content: {
        fontSize: 10,
        lineHeight: 1.4,
        marginBottom: 10
    }
});

const ResumePDF = ({ formData, aiContent }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{formData.personalInfo.fullName}</Text>
                <View style={styles.contactInfo}>
                    <Text>{formData.personalInfo.email}</Text>
                    <Text>{formData.personalInfo.phone}</Text>
                </View>
                <View style={styles.contactInfo}>
                    <Text>{formData.personalInfo.location}</Text>
                    <Text>{formData.personalInfo.linkedin}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.content}>{aiContent}</Text>
            </View>
        </Page>
    </Document>
);

export default ResumePDF;