USE [CollegeEventDB]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[UID] [int] NOT NULL,
	[EID] [int] NOT NULL,
	[Rating] [int] NOT NULL,
	[Comment] [text] NULL,
	[Timestamp] [bigint] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Events]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Events](
	[LID] [int] NOT NULL,
	[EID] [int] NOT NULL,
	[Name] [nchar](50) NOT NULL,
	[Date] [nchar](20) NOT NULL,
	[Start Time] [nchar](20) NOT NULL,
	[End Time] [nchar](20) NOT NULL,
	[Description] [text] NULL,
	[Contact Phone Number] [nchar](30) NOT NULL,
	[Contact Email Address] [nchar](40) NOT NULL,
	[Host_University] [nchar](10) NOT NULL,
	[Event_Type] [nchar](10) NOT NULL,
	[Host_RSO] [int] NULL,
 CONSTRAINT [PK_Events] PRIMARY KEY CLUSTERED 
(
	[EID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Location]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Location](
	[Name] [nchar](50) NOT NULL,
	[LID] [int] NOT NULL,
	[Address] [text] NOT NULL,
 CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED 
(
	[LID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RSO_Create_Requests]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RSO_Create_Requests](
	[Name] [nchar](50) NOT NULL,
	[Admin Email] [nchar](50) NOT NULL,
	[Member 1 Email] [nchar](50) NOT NULL,
	[Member 2 Email] [nchar](50) NOT NULL,
	[Member 3 Email] [nchar](50) NOT NULL,
	[Member 4 Email] [nchar](50) NOT NULL,
	[Member 5 Email] [nchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RSO_Join_Requests]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RSO_Join_Requests](
	[UID] [int] NOT NULL,
	[RSOID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RSO_Memberships]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RSO_Memberships](
	[RSOID] [int] NOT NULL,
	[UID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RSOs]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RSOs](
	[RSOID] [int] NOT NULL,
	[Admin] [int] NOT NULL,
	[Name] [nchar](50) NOT NULL,
	[Status] [nchar](10) NOT NULL,
 CONSTRAINT [PK_RSOs] PRIMARY KEY CLUSTERED 
(
	[RSOID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[University]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[University](
	[Description] [text] NULL,
	[Name] [nchar](50) NOT NULL,
	[UNIID] [int] NOT NULL,
	[LID] [int] NOT NULL,
 CONSTRAINT [PK_University] PRIMARY KEY CLUSTERED 
(
	[UNIID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[University_Affiliation]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[University_Affiliation](
	[UID] [int] NOT NULL,
	[UNIID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 4/18/2021 6:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UID] [int] NOT NULL,
	[Password] [nchar](40) NOT NULL,
	[Name] [nchar](40) NOT NULL,
	[Email] [nchar](40) NOT NULL,
	[Phone_Number] [nchar](30) NOT NULL,
	[User_Type] [nchar](20) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF__User__Phone_Numb__47DBAE45]  DEFAULT ('0') FOR [Phone_Number]
GO
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [default_User_Type]  DEFAULT ('User') FOR [User_Type]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK__Comments__EID__2F10007B] FOREIGN KEY([EID])
REFERENCES [dbo].[Events] ([EID])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK__Comments__EID__2F10007B]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK__Comments__UID__29572725] FOREIGN KEY([UID])
REFERENCES [dbo].[User] ([UID])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK__Comments__UID__29572725]
GO
ALTER TABLE [dbo].[Events]  WITH CHECK ADD  CONSTRAINT [FK__Events__LID__2E1BDC42] FOREIGN KEY([LID])
REFERENCES [dbo].[Location] ([LID])
GO
ALTER TABLE [dbo].[Events] CHECK CONSTRAINT [FK__Events__LID__2E1BDC42]
GO
ALTER TABLE [dbo].[Events]  WITH CHECK ADD  CONSTRAINT [FK_Events_RSOs] FOREIGN KEY([Host_RSO])
REFERENCES [dbo].[RSOs] ([RSOID])
GO
ALTER TABLE [dbo].[Events] CHECK CONSTRAINT [FK_Events_RSOs]
GO
ALTER TABLE [dbo].[RSO_Join_Requests]  WITH CHECK ADD  CONSTRAINT [FK_RSO_Join_Requests_RSOs] FOREIGN KEY([RSOID])
REFERENCES [dbo].[RSOs] ([RSOID])
GO
ALTER TABLE [dbo].[RSO_Join_Requests] CHECK CONSTRAINT [FK_RSO_Join_Requests_RSOs]
GO
ALTER TABLE [dbo].[RSO_Join_Requests]  WITH CHECK ADD  CONSTRAINT [FK_RSO_Join_Requests_User] FOREIGN KEY([UID])
REFERENCES [dbo].[User] ([UID])
GO
ALTER TABLE [dbo].[RSO_Join_Requests] CHECK CONSTRAINT [FK_RSO_Join_Requests_User]
GO
ALTER TABLE [dbo].[RSO_Memberships]  WITH CHECK ADD  CONSTRAINT [FK__RSO_Membe__RSOID__3F466844] FOREIGN KEY([RSOID])
REFERENCES [dbo].[RSOs] ([RSOID])
GO
ALTER TABLE [dbo].[RSO_Memberships] CHECK CONSTRAINT [FK__RSO_Membe__RSOID__3F466844]
GO
ALTER TABLE [dbo].[RSO_Memberships]  WITH CHECK ADD  CONSTRAINT [FK__RSO_Members__UID__3E52440B] FOREIGN KEY([UID])
REFERENCES [dbo].[User] ([UID])
GO
ALTER TABLE [dbo].[RSO_Memberships] CHECK CONSTRAINT [FK__RSO_Members__UID__3E52440B]
GO
ALTER TABLE [dbo].[RSOs]  WITH CHECK ADD  CONSTRAINT [FK_RSOs_User] FOREIGN KEY([Admin])
REFERENCES [dbo].[User] ([UID])
GO
ALTER TABLE [dbo].[RSOs] CHECK CONSTRAINT [FK_RSOs_User]
GO
ALTER TABLE [dbo].[University]  WITH CHECK ADD  CONSTRAINT [FK_University_Location] FOREIGN KEY([LID])
REFERENCES [dbo].[Location] ([LID])
GO
ALTER TABLE [dbo].[University] CHECK CONSTRAINT [FK_University_Location]
GO
ALTER TABLE [dbo].[University_Affiliation]  WITH CHECK ADD  CONSTRAINT [FK_University_Affiliation_University] FOREIGN KEY([UNIID])
REFERENCES [dbo].[University] ([UNIID])
GO
ALTER TABLE [dbo].[University_Affiliation] CHECK CONSTRAINT [FK_University_Affiliation_University]
GO
ALTER TABLE [dbo].[University_Affiliation]  WITH CHECK ADD  CONSTRAINT [FK_University_Affiliation_User] FOREIGN KEY([UID])
REFERENCES [dbo].[User] ([UID])
GO
ALTER TABLE [dbo].[University_Affiliation] CHECK CONSTRAINT [FK_University_Affiliation_User]
GO
