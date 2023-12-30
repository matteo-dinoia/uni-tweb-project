package login.service;

/*import util.JsonPrintable;*/

public class OperationResult /*extends JsonPrintable TODO FIX*/ {
    private final String operation;
    private final String username;
    private final boolean error;
    private final String errorStr;

    private OperationResult(String opName, String username) {
        this.operation = opName;
        this.username = username;

        this.error = false;
        this.errorStr = "";
    }

    private OperationResult(String opName, String username, String errorStr) {
        this.operation = opName;
        this.username = username;

        this.error = errorStr != null && !errorStr.isEmpty();
        this.errorStr = this.error ? errorStr : "";
    }

    public static OperationResult newStatus(String username){
        return new OperationResult("status", username == null ? "" : username);
    }

    public static OperationResult newLoginAttempt(String username, String error){
        return new OperationResult("login", username == null ? "" : username, error);
    }

    public static OperationResult newLogoutAttempt(String error){
        return new OperationResult("logout", "", error);
    }

}
