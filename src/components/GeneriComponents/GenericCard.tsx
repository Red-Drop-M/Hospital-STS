import { ReactNode } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
type GenericCardType = {
    Title? : ReactNode;
    Description? : ReactNode;
    Content? : ReactNode;
    Footer? : ReactNode;
    ClassName? : string;
    HeaderClassName?: string;
    TitleClassName?: string;
    DescriptionClassName? : string; 
    ContentClassName?: string;
    FooterClassName?: string;
}

export default function GenericCard({Title, Description, Content, Footer, 
    ClassName="",
    HeaderClassName="", 
    TitleClassName="", 
    DescriptionClassName="",
    ContentClassName="",
    FooterClassName=""
    } : GenericCardType ) {
  return (
    <Card className={ClassName}>
        {(Title || Description) && (
            <CardHeader className={HeaderClassName}>
                {Title && <CardTitle className={TitleClassName}>{Title}</CardTitle>}
                {Description && <CardDescription className={DescriptionClassName}>{Description}</CardDescription>}
            </CardHeader>
        )}
        {Content && <CardContent className={ContentClassName}>{Content}</CardContent>}
        {Footer && <CardFooter className={FooterClassName}>{Footer}</CardFooter>}
    </Card>
  )
}

