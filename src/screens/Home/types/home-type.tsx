export interface GeneralCardModel {
    label: string;
    backgroundColor: string;
    icon: React.ReactNode;
    gradientColors?: string[];
    isTrending?: boolean;
    tooltip?: string;
    count: number;
    percentageOfChange: string;
}

export interface GeneralStatInfoModel {
    [key: string]: GeneralCardModel;
}