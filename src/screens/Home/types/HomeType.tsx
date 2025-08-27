export interface GeneralCardModel {
    label: string;
    backgroundColor: string;
    icon: React.ReactNode;
    gradientColors?: string[];
}

export interface GeneralStatInfoModel {
    [key: string]: GeneralCardModel;
}