import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
  ShadingType,
} from "docx";

const FONT_MAPPING = {
  sans: "Calibri",
  serif: "Georgia",
  mono: "Consolas",
  system: "Segoe UI",
};

const COLOR_MAPPING = {
  indigo: {
    primary: "1E1B4B",
    accent: "4F46E5",
    accentDark: "4338CA",
    bgTint: "EEF2FF",
    bgBadge: "E0E7FF",
    border: "C7D2FE",
    borderSubtle: "E0E7FF",
    dotSeparator: "A5B4FC",
  },
  emerald: {
    primary: "064E3B",
    accent: "059669",
    accentDark: "047857",
    bgTint: "ECFDF5",
    bgBadge: "D1FAE5",
    border: "A7F3D0",
    borderSubtle: "D1FAE5",
    dotSeparator: "6EE7B7",
  },
  ocean: {
    primary: "082F49",
    accent: "0284C7",
    accentDark: "0369A1",
    bgTint: "F0F9FF",
    bgBadge: "E0F2FE",
    border: "BAE6FD",
    borderSubtle: "E0F2FE",
    dotSeparator: "7DD3FC",
  },
  rose: {
    primary: "4C0519",
    accent: "E11D48",
    accentDark: "BE123C",
    bgTint: "FFF1F2",
    bgBadge: "FFE4E6",
    border: "FECDD3",
    borderSubtle: "FFE4E6",
    dotSeparator: "FDA4AF",
  },
  default: {
    primary: "111827",
    accent: "374151",
    accentDark: "1F2937",
    bgTint: "F9FAFB",
    bgBadge: "F3F4F6",
    border: "111827",
    borderSubtle: "E5E7EB",
    dotSeparator: "9CA3AF",
  },
};

const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

/**
 * Builds a clean, ATS-compliant Microsoft Word (.docx) document from resume state
 * accurately matching the selected style (Modern, Classic, Compact, Executive) and theme colors.
 * @param {Object} resume - Resume data object
 * @param {Object} options - Custom styling options
 * @returns {Document} docx Document instance
 */
export function buildResumeDocx(resume = {}, options = {}) {
  const {
    activeCategory = "standard", // "standard" | "fresher"
    activeStyle = "classic", // "classic" | "executive" | "compact" | "modern"
    modernColor = "indigo", // "indigo" | "emerald" | "ocean" | "rose"
    activeFont = "sans", // "sans" | "serif" | "mono" | "system"
  } = options;

  const fontName = FONT_MAPPING[activeFont] || "Calibri";
  const isModern = activeStyle === "modern";
  const isCompact = activeStyle === "compact";
  const isExecutive = activeStyle === "executive";

  const colors = isModern
    ? COLOR_MAPPING[modernColor] || COLOR_MAPPING.indigo
    : COLOR_MAPPING.default;

  const primaryColor = colors.primary;
  const accentColor = colors.accent;
  const accentDarkColor = colors.accentDark || colors.accent;
  const subtleColor = isModern ? "475569" : "4B5563";
  const bodyTextColor = isModern ? "334155" : "374151";

  // Section title resolver
  const getTitle = (key) => {
    if (
      resume.sectionTitles &&
      resume.sectionTitles[key] !== undefined &&
      resume.sectionTitles[key] !== ""
    ) {
      return resume.sectionTitles[key];
    }
    switch (key) {
      case "summary":
        return activeCategory === "fresher"
          ? "Career Objective & Summary"
          : "Professional Summary";
      case "skills":
        return "Technical Skills";
      case "experience":
        return activeCategory === "fresher"
          ? "Experience & Internships"
          : "Engineering Experience";
      case "projects":
        return "Featured Projects";
      case "education":
        return "Education & Credentials";
      default:
        return key.toUpperCase();
    }
  };

  // Section Heading Builder
  const createSectionHeading = (title) => {
    if (isModern) {
      // Modern style: Shaded banner table with thick left accent border
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "auto" },
          right: { style: BorderStyle.NONE, size: 0, color: "auto" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
          left: {
            style: BorderStyle.SINGLE,
            size: 24, // 3pt thickness
            color: accentColor,
          },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: {
                  type: ShadingType.CLEAR,
                  fill: colors.bgTint,
                },
                margins: { top: 60, bottom: 60, left: 140, right: 100 },
                children: [
                  new Paragraph({
                    spacing: { before: 0, after: 0 },
                    children: [
                      new TextRun({
                        text: title.toUpperCase(),
                        bold: true,
                        size: 21,
                        color: primaryColor,
                        font: fontName,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }

    // Classic / Compact / Executive heading
    const align = isExecutive ? AlignmentType.CENTER : AlignmentType.LEFT;
    return new Paragraph({
      alignment: align,
      spacing: { before: isCompact ? 140 : 180, after: isCompact ? 40 : 60 },
      border: {
        bottom: {
          color: primaryColor,
          size: isCompact ? 8 : 12,
          style: BorderStyle.SINGLE,
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: isCompact ? 20 : 21,
          color: primaryColor,
          font: fontName,
        }),
      ],
    });
  };

  const createTwoColRow = (
    leftText,
    rightText,
    isBold = true,
    leftSize = isCompact ? 19 : 20,
    rightSize = isCompact ? 17 : 18,
    leftColor = primaryColor,
    rightColor = isModern ? accentDarkColor : subtleColor
  ) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: NO_BORDER,
              width: { size: 72, type: WidthType.PERCENTAGE },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              children: [
                new Paragraph({
                  spacing: { before: isCompact ? 20 : 40, after: 10 },
                  children: [
                    new TextRun({
                      text: leftText,
                      bold: isBold,
                      size: leftSize,
                      color: leftColor,
                      font: fontName,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: NO_BORDER,
              width: { size: 28, type: WidthType.PERCENTAGE },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: isCompact ? 20 : 40, after: 10 },
                  children: [
                    new TextRun({
                      text: rightText || "",
                      bold: isBold,
                      size: rightSize,
                      color: rightColor,
                      font: fontName,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const children = [];

  // =========================================================
  // 1. HEADER (Candidate Name, Target Role, Contact Line)
  // =========================================================
  const contactChildren = [];
  const addContactItem = (label, url = null) => {
    if (contactChildren.length > 0) {
      contactChildren.push(
        new TextRun({
          text: "  •  ",
          color: isModern ? colors.dotSeparator : "9CA3AF",
          size: isCompact ? 17 : 18,
          font: fontName,
        })
      );
    }
    if (url) {
      contactChildren.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: label,
              color: isModern ? accentColor : "2563EB",
              underline: {},
              size: isCompact ? 17 : 18,
              font: fontName,
            }),
          ],
          link: url,
        })
      );
    } else {
      contactChildren.push(
        new TextRun({
          text: label,
          color: isModern ? "334155" : subtleColor,
          size: isCompact ? 17 : 18,
          font: fontName,
        })
      );
    }
  };

  if (resume.location) addContactItem(resume.location);
  if (resume.email) addContactItem(resume.email, `mailto:${resume.email}`);
  if (resume.phone) addContactItem(resume.phone, `tel:${resume.phone}`);
  if (resume.linkedin) {
    const lkUrl = resume.linkedin.startsWith("http")
      ? resume.linkedin
      : `https://${resume.linkedin}`;
    addContactItem("LinkedIn", lkUrl);
  }
  if (resume.github) {
    const ghUrl = resume.github.startsWith("http")
      ? resume.github
      : `https://${resume.github}`;
    addContactItem("GitHub", ghUrl);
  }
  if (resume.website) {
    const webUrl = resume.website.startsWith("http")
      ? resume.website
      : `https://${resume.website}`;
    addContactItem("Portfolio", webUrl);
  }

  if (isModern) {
    // Modern Header: Full width shaded card with border
    const modernHeaderParagraphs = [
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({
            text: (resume.name || "YOUR NAME").toUpperCase(),
            bold: true,
            size: 30,
            color: primaryColor,
            font: fontName,
          }),
          ...(resume.targetRole
            ? [
                new TextRun({
                  text: "   |   ",
                  size: 20,
                  color: colors.border,
                  font: fontName,
                }),
                new TextRun({
                  text: resume.targetRole,
                  bold: true,
                  size: 20,
                  color: accentDarkColor,
                  font: fontName,
                }),
              ]
            : []),
        ],
      }),
    ];

    if (contactChildren.length > 0) {
      modernHeaderParagraphs.push(
        new Paragraph({
          spacing: { before: 0, after: 0 },
          children: contactChildren,
        })
      );
    }

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "auto" },
          left: { style: BorderStyle.NONE, size: 0, color: "auto" },
          right: { style: BorderStyle.NONE, size: 0, color: "auto" },
          bottom: { style: BorderStyle.SINGLE, size: 16, color: colors.border },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: {
                  type: ShadingType.CLEAR,
                  fill: colors.bgTint,
                },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: modernHeaderParagraphs,
              }),
            ],
          }),
        ],
      })
    );

    // Spacing between modern header and first section
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 0 },
        children: [],
      })
    );
  } else {
    // Classic / Executive / Compact Header
    const headerAlignment = isExecutive
      ? AlignmentType.CENTER
      : AlignmentType.LEFT;

    // Name
    children.push(
      new Paragraph({
        alignment: headerAlignment,
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({
            text: (resume.name || "YOUR NAME").toUpperCase(),
            bold: true,
            size: isCompact ? 28 : 32,
            color: primaryColor,
            font: fontName,
          }),
        ],
      })
    );

    // Target Role
    if (resume.targetRole) {
      children.push(
        new Paragraph({
          alignment: headerAlignment,
          spacing: { before: 0, after: 30 },
          children: [
            new TextRun({
              text: resume.targetRole,
              bold: true,
              size: isCompact ? 19 : 20,
              color: subtleColor,
              font: fontName,
            }),
          ],
        })
      );
    }

    // Contact Line
    if (contactChildren.length > 0) {
      children.push(
        new Paragraph({
          alignment: headerAlignment,
          spacing: { before: 0, after: isCompact ? 80 : 120 },
          border: {
            bottom: {
              color: "111827",
              size: isCompact ? 8 : 12,
              style: BorderStyle.SINGLE,
              space: 4,
            },
          },
          children: contactChildren,
        })
      );
    }
  }

  // =========================================================
  // 2. PROFESSIONAL SUMMARY
  // =========================================================
  if (resume.summary) {
    children.push(createSectionHeading(getTitle("summary")));
    children.push(
      new Paragraph({
        spacing: { before: isModern ? 60 : 30, after: isCompact ? 50 : 80 },
        children: [
          new TextRun({
            text: resume.summary,
            size: isCompact ? 18 : 19,
            color: bodyTextColor,
            font: fontName,
          }),
        ],
      })
    );
  }

  // =========================================================
  // 3. SECTION BUILDERS (Skills, Experience, Projects, Education)
  // =========================================================

  const buildSkillsSection = () => {
    if (
      !resume.skillCategories ||
      Object.keys(resume.skillCategories).length === 0
    ) {
      return null;
    }
    const elements = [createSectionHeading(getTitle("skills"))];
    for (const [category, items] of Object.entries(resume.skillCategories)) {
      elements.push(
        new Paragraph({
          spacing: { before: isModern ? 30 : 15, after: isModern ? 30 : 15 },
          children: [
            new TextRun({
              text: `•  ${category}: `,
              bold: true,
              size: isCompact ? 18 : 19,
              color: primaryColor,
              font: fontName,
            }),
            new TextRun({
              text: items,
              size: isCompact ? 18 : 19,
              color: bodyTextColor,
              font: fontName,
            }),
          ],
        })
      );
    }
    if (isModern) {
      elements.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
    }
    return elements;
  };

  const buildExperienceSection = () => {
    if (!resume.experience || resume.experience.length === 0) {
      return null;
    }
    const elements = [createSectionHeading(getTitle("experience"))];
    for (const exp of resume.experience) {
      elements.push(
        createTwoColRow(
          exp.role || "",
          exp.period || "",
          true,
          isCompact ? 19 : 20,
          isCompact ? 17 : 18,
          primaryColor,
          isModern ? accentDarkColor : subtleColor
        )
      );

      if (exp.organization) {
        elements.push(
          new Paragraph({
            spacing: { before: 0, after: 20 },
            children: [
              new TextRun({
                text: `${exp.organization}${exp.location ? ` — ${exp.location}` : ""}`,
                italics: true,
                size: isCompact ? 17 : 18,
                color: isModern ? accentDarkColor : subtleColor,
                font: fontName,
              }),
            ],
          })
        );
      }

      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          if (bullet && bullet.trim()) {
            elements.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 10, after: 10 },
                children: [
                  new TextRun({
                    text: bullet,
                    size: isCompact ? 18 : 19,
                    color: bodyTextColor,
                    font: fontName,
                  }),
                ],
              })
            );
          }
        }
      }
    }
    if (isModern) {
      elements.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
    }
    return elements;
  };

  const buildProjectsSection = () => {
    if (!resume.projects || resume.projects.length === 0) {
      return null;
    }
    const elements = [createSectionHeading(getTitle("projects"))];
    for (const proj of resume.projects) {
      elements.push(
        createTwoColRow(
          proj.title || "",
          proj.tech || "",
          true,
          isCompact ? 19 : 20,
          isCompact ? 17 : 18,
          primaryColor,
          isModern ? accentDarkColor : subtleColor
        )
      );

      if (proj.bullets && proj.bullets.length > 0) {
        for (const bullet of proj.bullets) {
          if (bullet && bullet.trim()) {
            elements.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 10, after: 10 },
                children: [
                  new TextRun({
                    text: bullet,
                    size: isCompact ? 18 : 19,
                    color: bodyTextColor,
                    font: fontName,
                  }),
                ],
              })
            );
          }
        }
      }
    }
    if (isModern) {
      elements.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
    }
    return elements;
  };

  const buildEducationSection = () => {
    if (!resume.education || resume.education.length === 0) {
      return null;
    }
    const elements = [createSectionHeading(getTitle("education"))];
    for (const edu of resume.education) {
      elements.push(
        createTwoColRow(
          edu.degree || "",
          edu.period || edu.year || "",
          true,
          isCompact ? 19 : 20,
          isCompact ? 17 : 18,
          primaryColor,
          isModern ? accentDarkColor : subtleColor
        )
      );

      elements.push(
        new Paragraph({
          spacing: { before: 0, after: 20 },
          children: [
            new TextRun({
              text: `${edu.institution || ""}${edu.location ? `, ${edu.location}` : ""}`,
              italics: true,
              size: isCompact ? 17 : 18,
              color: isModern ? accentDarkColor : subtleColor,
              font: fontName,
            }),
          ],
        })
      );

      if (edu.grade || edu.details) {
        elements.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 10, after: 10 },
            children: [
              new TextRun({
                text: edu.grade || edu.details,
                size: isCompact ? 17 : 18,
                color: isModern ? "475569" : subtleColor,
                font: fontName,
              }),
            ],
          })
        );
      }
    }
    if (isModern) {
      elements.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
    }
    return elements;
  };

  // Section order according to category track:
  const sectionList =
    activeCategory === "fresher"
      ? [
          buildEducationSection(),
          buildSkillsSection(),
          buildProjectsSection(),
          buildExperienceSection(),
        ]
      : [
          buildSkillsSection(),
          buildExperienceSection(),
          buildProjectsSection(),
          buildEducationSection(),
        ];

  sectionList.forEach((sec) => {
    if (sec && sec.length > 0) {
      children.push(...sec);
    }
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: isCompact ? 576 : 720, // 0.4in or 0.5in in dxa
              right: isCompact ? 576 : 720,
              bottom: isCompact ? 576 : 720,
              left: isCompact ? 576 : 720,
            },
          },
        },
        children,
      },
    ],
  });
}

/**
 * Generates and triggers browser download of an ATS-compliant .docx resume
 * @param {Object} resume - Resume data
 * @param {Object} options - Customizer options (activeCategory, activeStyle, modernColor, activeFont)
 */
export async function downloadResumeDocx(resume, options = {}) {
  const doc = buildResumeDocx(resume, options);
  const blob = await Packer.toBlob(doc);

  const rawName = (resume?.name || "Hashim_Malik")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${rawName || "Resume"}_ATS_Resume.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
