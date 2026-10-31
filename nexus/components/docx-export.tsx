import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

interface Section {
  section: string;
  content: Array<{
    subsection?: string;
    content?:
      | string
      | Array<{
          subsubsection?: string;
          content: string;
        }>;
  }>;
}

interface DocumentData {
  name: string;
  description: string;
  status: string;
  body: string | null;
  docBody?: string;
  erDiagram?: string;
  useCaseDiagram?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project: {
    name: string;
    description: string;
    projectType: string;
    complexity: string;
    completionStatus: string;
  };
}

export const exportToDocx = async (
  docData: DocumentData,
  parsedDocBody: Section[],
  formatISODate: (date: string) => string
) => {
  try {
    const sections: (Paragraph | Table)[] = [];

    // Add document title
    sections.push(
      new Paragraph({
        text: docData.name,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Add document description
    sections.push(
      new Paragraph({
        text: docData.description,
        style: "Normal",
        spacing: { after: 200 },
        alignment: AlignmentType.CENTER,
      })
    );

    // Add project details table
   
    sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    // Helper function to parse markdown and create TextRun children
    const parseMarkdown = (text: string): TextRun[] => {
      const children: TextRun[] = [];
      let currentText = "";
      let isBold = false;
      let isItalic = false;

      for (let i = 0; i < text.length; i++) {
        if (
          text.substring(i, i + 2) === "**" ||
          text.substring(i, i + 2) === "__"
        ) {
          if (currentText) {
            children.push(
              new TextRun({
                text: currentText,
                bold: isBold,
                italics: isItalic,
              })
            );
            currentText = "";
          }
          isBold = !isBold;
          i++; // Skip the second character
        } else if (text[i] === "*" || text[i] === "_") {
          if (currentText) {
            children.push(
              new TextRun({
                text: currentText,
                bold: isBold,
                italics: isItalic,
              })
            );
            currentText = "";
          }
          isItalic = !isItalic;
        } else {
          currentText += text[i];
        }
      }

      if (currentText) {
        children.push(
          new TextRun({
            text: currentText,
            bold: isBold,
            italics: isItalic,
          })
        );
      }

      return children;
    };

    // Add document content based on the structure
    if (parsedDocBody.length > 0) {
      // Process structured document
      parsedDocBody.forEach((section) => {
        // Add section heading
        sections.push(
          new Paragraph({
            text: section.section,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );

        // Process subsections
        section.content.forEach((subsectionData) => {
          if (subsectionData.subsection) {
            sections.push(
              new Paragraph({
                text: subsectionData.subsection,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 80 },
              })
            );
          }

          // Process content
          if (typeof subsectionData.content === "string") {
            // Handle markdown in content
            const contentLines = subsectionData.content.split("\n");
            let inList = false;

            contentLines.forEach((line) => {
              if (line.trim()) {
                // Check for list items
                if (line.startsWith("- ") || line.startsWith("* ")) {
                  inList = true;
                  const listText = line.substring(2);
                  const children = parseMarkdown(listText);
                  sections.push(
                    new Paragraph({
                      children,
                      bullet: { level: 0 },
                    })
                  );
                } else if (line.match(/^\d+\.\s/)) {
                  // Numbered list
                  inList = true;
                  const textContent = line.replace(/^\d+\.\s/, "");
                  const children = parseMarkdown(textContent);
                  sections.push(
                    new Paragraph({
                      children,
                      numbering: { reference: "default-numbering", level: 0 },
                    })
                  );
                } else {
                  // Regular paragraph with markdown parsing
                  if (inList) inList = false;
                  const children = parseMarkdown(line);
                  sections.push(new Paragraph({ children }));
                }
              } else if (inList) {
                // Empty line after list
                inList = false;
                sections.push(new Paragraph({ text: "" }));
              } else {
                // Empty line
                sections.push(new Paragraph({ text: "" }));
              }
            });
          } else if (Array.isArray(subsectionData.content)) {
            // Process subsubsections
            subsectionData.content.forEach((subsubsection) => {
              if (subsubsection.subsubsection) {
                sections.push(
                  new Paragraph({
                    text: subsubsection.subsubsection,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 160, after: 60 },
                  })
                );
              }

              // Handle markdown in content
              const contentLines = subsubsection.content.split("\n");
              let inList = false;

              contentLines.forEach((line) => {
                if (line.trim()) {
                  // Check for list items
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    inList = true;
                    const listText = line.substring(2);
                    const children = parseMarkdown(listText);
                    sections.push(
                      new Paragraph({
                        children,
                        bullet: { level: 0 },
                      })
                    );
                  } else if (line.match(/^\d+\.\s/)) {
                    // Numbered list
                    inList = true;
                    const textContent = line.replace(/^\d+\.\s/, "");
                    const children = parseMarkdown(textContent);
                    sections.push(
                      new Paragraph({
                        children,
                        numbering: { reference: "default-numbering", level: 0 },
                      })
                    );
                  } else {
                    // Regular paragraph with markdown parsing
                    if (inList) inList = false;
                    const children = parseMarkdown(line);
                    sections.push(new Paragraph({ children }));
                  }
                } else if (inList) {
                  // Empty line after list
                  inList = false;
                  sections.push(new Paragraph({ text: "" }));
                } else {
                  // Empty line
                  sections.push(new Paragraph({ text: "" }));
                }
              });
            });
          }
        });
      });
    } else if (docData.body) {
      // Process markdown content
      const contentLines = docData.body.split("\n");
      let inList = false;

      contentLines.forEach((line) => {
        if (line.trim()) {
          // Check for headings
          if (line.startsWith("# ")) {
            sections.push(
              new Paragraph({
                text: line.substring(2),
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 240, after: 120 },
              })
            );
          } else if (line.startsWith("## ")) {
            sections.push(
              new Paragraph({
                text: line.substring(3),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 80 },
              })
            );
          } else if (line.startsWith("### ")) {
            sections.push(
              new Paragraph({
                text: line.substring(4),
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 160, after: 60 },
              })
            );
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            // Handle list items
            if (!inList) {
              inList = true;
            }
            const listText = line.substring(2);
            const children = parseMarkdown(listText);
            sections.push(
              new Paragraph({
                children,
                bullet: { level: 0 },
              })
            );
          } else {
            // Regular paragraph with markdown parsing
            if (inList) {
              inList = false;
            }
            const children = parseMarkdown(line);
            sections.push(new Paragraph({ children }));
          }
        } else {
          // Empty line
          sections.push(new Paragraph({ text: "" }));
        }
      });
    }

    // Add document footer with metadata
    sections.push(new Paragraph({ text: "", spacing: { before: 400 } }));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Created by: ", bold: true }),
          new TextRun({ text: docData.createdBy }),
        ],
      })
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Created: ", bold: true }),
          new TextRun({ text: formatISODate(docData.createdAt) }),
        ],
      })
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Last Updated: ", bold: true }),
          new TextRun({ text: formatISODate(docData.updatedAt) }),
        ],
      })
    );

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${docData.name}.docx`);

    return true;
  } catch (err) {
    console.error("Error generating DOCX:", err);
    return false;
  }
};
