import sketch from 'sketch'

export default function(context) {
    const doc = sketch.getSelectedDocument()
    doc.getSelectedDocument.selectedLayers.forEach(element => {
        console.log(element);
    });
}