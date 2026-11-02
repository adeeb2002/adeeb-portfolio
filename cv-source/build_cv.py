"""Builds public/Adeeb_Sultan_Cv_new.pdf — an ATS-friendly, single-column CV.

Layout, fonts, sizes, colours and section structure are matched to the reference CV
(Mahmoud-Miqdad-CV.pdf): US Letter, Calibri, centred header with hyperlinked contact
line, bold uppercase section titles over a thin grey rule, "Role | Company" lines with a
right-aligned date, italic one-line context, bullets, and a "Tech stack:" line per project.

ATS rules: one column, real selectable text, no tables/images/icons, standard section names.

Run:  python cv-source/build_cv.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    CondPageBreak,
    Flowable,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)

OUT = Path(__file__).resolve().parent.parent / "public" / "Adeeb_Sultan_Cv_new.pdf"

# ---------- fonts (same family as the reference) ----------
FONTS = Path("C:/Windows/Fonts")
for name, file in [
    ("Calibri", "calibri.ttf"),
    ("Calibri-Bold", "calibrib.ttf"),
    ("Calibri-Italic", "calibrii.ttf"),
    ("Calibri-BoldItalic", "calibriz.ttf"),
]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFontFamily(
    "Calibri", normal="Calibri", bold="Calibri-Bold", italic="Calibri-Italic", boldItalic="Calibri-BoldItalic"
)

# ---------- palette measured from the reference ----------
BLACK = colors.HexColor("#000000")
HEAD = colors.HexColor("#1A1A1A")
BODY = colors.HexColor("#333333")
GRAY = colors.HexColor("#595959")
GRAY_IT = colors.HexColor("#5C5C5C")
GRAY_TECH = colors.HexColor("#666666")
RULE = colors.HexColor("#808080")
LINK = "#0F4C81"  # hyperlink colour used by the reference

SZ = 9.48  # body size
LD = 13.3  # body leading

S = {
    "name": ParagraphStyle("name", fontName="Calibri-Bold", fontSize=21, leading=25, alignment=TA_CENTER, textColor=BLACK),
    "title": ParagraphStyle("title", fontName="Calibri", fontSize=11.04, leading=15, alignment=TA_CENTER, textColor=GRAY),
    "contact": ParagraphStyle("contact", fontName="Calibri", fontSize=9, leading=12, alignment=TA_CENTER, textColor=GRAY),
    "h": ParagraphStyle("h", fontName="Calibri-Bold", fontSize=11.52, leading=14, textColor=HEAD),
    "body": ParagraphStyle("body", fontName="Calibri", fontSize=SZ, leading=LD, textColor=BODY),
    "comp": ParagraphStyle("comp", fontName="Calibri", fontSize=SZ, leading=LD, textColor=BODY, spaceBefore=3),
    "bullet": ParagraphStyle(
        "bullet", fontName="Calibri", fontSize=SZ, leading=LD, textColor=BODY,
        leftIndent=14.2, firstLineIndent=-5.4, bulletIndent=1.7, bulletFontName="Calibri", bulletFontSize=SZ, spaceBefore=3,
    ),
    "tech": ParagraphStyle(
        "tech", fontName="Calibri", fontSize=8.5, leading=12, textColor=GRAY_TECH,
        leftIndent=14.2, firstLineIndent=-5.4, bulletIndent=1.7, bulletFontName="Calibri", bulletFontSize=SZ, spaceBefore=3,
    ),
    "role": ParagraphStyle("role", fontName="Calibri", fontSize=SZ, leading=LD, textColor=BODY),
    "date": ParagraphStyle("date", fontName="Calibri-Bold", fontSize=9, leading=LD, textColor=GRAY),
    "italic": ParagraphStyle("italic", fontName="Calibri-Italic", fontSize=9, leading=12, textColor=GRAY_IT, spaceBefore=1.5),
}

SEP = "&nbsp;&nbsp;|&nbsp;&nbsp;"
DOT = "&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;"


class Row(Flowable):
    """Left text (may wrap) with right-aligned text on the same baseline — no table needed."""

    def __init__(self, left, right, lstyle, rstyle, gap=12):
        super().__init__()
        self.left, self.right, self.ls, self.rs, self.gap = left, right, lstyle, rstyle, gap

    def wrap(self, aw, ah):
        self.aw = aw
        rw = stringWidth(self.right, self.rs.fontName, self.rs.fontSize) if self.right else 0
        self.p = Paragraph(self.left, self.ls)
        _, self.h = self.p.wrap(aw - rw - self.gap, ah)
        return aw, self.h

    def draw(self):
        self.p.drawOn(self.canv, 0, self.h - self.p.height)
        if self.right:
            c = self.canv
            c.setFont(self.rs.fontName, self.rs.fontSize)
            c.setFillColor(self.rs.textColor)
            c.drawRightString(self.aw, self.h - self.ls.fontSize, self.right)


def link(text, href):
    """Underlined dark-blue hyperlink, like the reference."""
    return f'<link href="{href}" color="{LINK}"><u>{text}</u></link>'


def section(title):
    return [
        CondPageBreak(90),
        Spacer(1, 12.5),
        Paragraph(title.upper(), S["h"]),
        HRFlowable(width="100%", thickness=0.75, color=RULE, spaceBefore=3, spaceAfter=4),
    ]


def bullet(text):
    return Paragraph(text, S["bullet"], bulletText="•")


def tech(stack):
    return Paragraph(
        f'<font name="Calibri-Bold" color="#1A1A1A">Tech stack:</font> {stack}', S["tech"], bulletText="•"
    )


def comp(label, text):
    return Paragraph(f"<b>{label}:</b>&nbsp;&nbsp;{text}", S["comp"])


def entry(head_left, date, context, bullets):
    """Role | Company ........ Date, italic context line, then bullets."""
    top = [Row(head_left, date, S["role"], S["date"])]
    if context:
        top.append(Paragraph(context, S["italic"]))
    top.append(bullet(bullets[0]))
    return [KeepTogether(top)] + [bullet(b) for b in bullets[1:]] + [Spacer(1, 6)]


def project(title, links, stack, bullets, note=None):
    head = f"<b>{title}</b>" + "".join(SEP + l for l in links)
    top = [Row(head, note or "", S["role"], ParagraphStyle("note", parent=S["italic"], fontSize=9, leading=LD)), bullet(bullets[0])]
    return [KeepTogether(top)] + [bullet(b) for b in bullets[1:]] + [tech(stack), Spacer(1, 6)]


story = []

# ---------- header ----------
story += [
    Paragraph("Adeeb Sultan", S["name"]),
    Paragraph("Mobile Application Engineer" + SEP + "Flutter &amp; Native Android", S["title"]),
    Spacer(1, 1.5),
    Paragraph(
        "Palestine"
        + DOT
        + "+972 59 328 2184"
        + DOT
        + link("adeebsaltan@gmail.com", "mailto:adeebsaltan@gmail.com")
        + DOT
        + link("LinkedIn", "https://www.linkedin.com/in/adeeb-sultan-1253b3292/")
        + DOT
        + link("GitHub", "https://github.com/adeeb2002")
        + DOT
        + link("Portfolio", "https://adeeb2002.github.io/portfolio/"),
        S["contact"],
    ),
]

# ---------- profile summary ----------
story += section("Profile Summary")
story.append(
    Paragraph(
        "Mobile Application Engineer with 3.5+ years of experience building cross-platform apps in Flutter and Dart and "
        "native Android apps in Java. Delivered <b>5+ production Flutter applications</b> for regional and international "
        "clients, owning the full lifecycle from Figma prototype to store release. Applies Clean Architecture with "
        "Riverpod and Bloc, designs offline-first storage (Hive, SQLite, Room), and integrates REST APIs and "
        "Firebase/Supabase back ends. Software Engineering &amp; Databases student at An-Najah National University "
        "(expected graduation 2026).",
        S["body"],
    )
)

# ---------- core competencies ----------
story += section("Core Competencies")
story += [
    comp("Mobile", "Flutter SDK, Dart, Native Android SDK (Java), Cross-Platform Engineering, Material Design"),
    comp("Architecture", "Clean Architecture, MVVM, OOP, Offline-First Design"),
    comp("State Management", "Riverpod, Bloc, Provider, GetX"),
    comp("Backend &amp; Cloud", "RESTful APIs, Firebase (Firestore, FCM, Auth), Supabase, OneSignal, OAuth, Retrofit"),
    comp("Databases &amp; Storage", "Hive, SQLite, Room DB, Shared Preferences, SQL"),
    comp("Programming", "Dart, Java, SQL, HTML, CSS"),
    comp("Tools", "Git, GitHub, Android Studio, VS Code, Postman, Figma, WorkManager, Linux"),
    comp("Languages", "Arabic (Native), English (Professional Proficiency)"),
]

# ---------- experience ----------
story += section("Experience")
story += entry(
    f"<b>Flutter Mobile Developer, Freelance</b>{SEP}Client Projects",
    "May 2023 – Present",
    "Freelance engagements building Flutter apps for regional and international clients.",
    [
        "Architected, developed, and deployed 5+ production-grade Flutter applications, owning the full lifecycle "
        "from wireframing to store publication.",
        "Built scalable state management with Riverpod and Bloc, improving maintainability and scalability across "
        "iOS and Android.",
        "Designed offline-first caching with Hive and SQLite to cut redundant network requests and improve app "
        "startup time.",
        "Integrated RESTful JSON APIs, OAuth flows, and push notification pipelines using Firebase, Supabase, and OneSignal.",
        "Translated Figma UI/UX mockups into responsive, pixel-accurate Flutter screens following Material Design guidelines.",
    ],
)
story += entry(
    f"<b>Android Developer</b>{SEP}Independent Software Projects",
    "2022 – 2023",
    "Native Android applications built in Java.",
    [
        "Developed native Android applications in Java using MVVM and Material Design components.",
        "Implemented networking with Retrofit, offline storage with Room DB, and background scheduling with WorkManager.",
    ],
)

# ---------- education & certifications ----------
story += section("Education &amp; Certifications")
story += [
    KeepTogether(
        [
            Row(
                f"<b>B.Sc. in Software Engineering &amp; Databases</b>{SEP}An-Najah National University — Palestine",
                "Expected 2026",
                S["role"],
                S["date"],
            ),
            Spacer(1, 6),
            Paragraph("<b>Meta Android Developer Professional Certificate</b>", S["role"]),
            Spacer(1, 6),
            Paragraph("<b>Google Flutter Development Certificate</b>", S["role"]),
            Spacer(1, 4),
        ]
    )
]

# ---------- technical projects ----------
story += section("Technical Projects")
story += project(
    "LuxCar — Automotive Marketplace &amp; Spec Finder",
    [link("GitHub", "https://github.com/adeeb2002/LuxCar")],
    "Flutter, Dart, Firebase, REST APIs",
    [
        "Built a vehicle catalog app integrating the Auto.dev and CarImages REST APIs for live specs and "
        "high-resolution media.",
        "Implemented secure user authentication and real-time database management with Firebase.",
    ],
)
story += project(
    "Radio Ava — Audio &amp; Music Streaming Platform",
    [],
    "Flutter, REST APIs, Hive",
    [
        "Architected a continuous audio streaming app with background playback and persistent custom playlists.",
        "Integrated Hive local caching for seamless offline playback and immediate synchronization of user favorites.",
    ],
)
story += project(
    "Movie &amp; Media Discovery Platform",
    [link("GitHub", "https://github.com/adeeb2002/Movie-App")],
    "Flutter, TMDb API, Firebase, Supabase, Hive",
    [
        "Built a media discovery app consuming TMDb REST APIs with real-time Firestore bookmark sync.",
        "Engineered an offline-first architecture with Hive local caching to minimize network usage and speed up loading.",
    ],
)
story += project(
    "Kupa — E-Commerce Application",
    [],
    "Flutter, Firebase, Figma, State Management",
    [
        "Built a full-featured shopping app with product catalog filtering, cart state management, and a "
        "streamlined checkout flow.",
    ],
)
story += project(
    "Real-Time Messaging Platform",
    [link("GitHub", "https://github.com/adeeb2002/chat_app")],
    "Flutter, Riverpod, Firebase, OneSignal",
    [
        "Created a low-latency instant messaging app with multi-device sync and customized background push notifications.",
    ],
)


# ---------- build ----------
def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
        title="Adeeb Sultan - CV",
        author="Adeeb Sultan",
        subject="Mobile Application Engineer (Flutter & Android) - CV",
        keywords="Flutter, Dart, Android, Java, Riverpod, Bloc, Firebase, Supabase, Hive, SQLite, Clean Architecture",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
        id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="cv", frames=[frame])])
    doc.build(story)
    print("written", OUT)


if __name__ == "__main__":
    build()
