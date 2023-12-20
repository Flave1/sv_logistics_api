/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
/// <reference types="multer" />
import { Request } from 'express';
import { Socket } from 'socket.io';
export type CreatePollFields = {
    topic: string;
    votesPerVoter: number;
    name: string;
};
export type JoinPollFields = {
    pollID: string;
    name: string;
};
export type RejoinPollFields = {
    pollID: string;
    userID: string;
    name: string;
};
export type AddParticipantFields = {
    pollID: string;
    userID: string;
    name: string;
};
export type AddNominationFields = {
    pollID: string;
    userID: string;
    text: string;
};
export type SubmitRankingsFields = {
    pollID: string;
    userID: string;
    rankings: string[];
};
export type CreatePollData = {
    pollID: string;
    topic: string;
    votesPerVoter: number;
    userID: string;
};
export type AddParticipantData = {
    pollID: string;
    userID: string;
    name: string;
};
export type AddNominationData = {
    pollID: string;
    nominationID: string;
};
export type AddParticipantRankingsData = {
    pollID: string;
    userID: string;
    rankings: string[];
};
export type AuthPayload = {
    userID: string;
    restaurantId: string;
    name: string;
    email: string;
};
export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
export type PayloadData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    restaurantId: number;
    token: string;
};
export interface JoinRoom {
    roomName: string;
}
export interface SocketResponse {
    message?: string;
}
export type AuthDataWithToken = Express.Request & PayloadData;
