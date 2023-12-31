package json;

public class JsonResponse<T> {
    private String error = null;
    private T value = null;

    public JsonResponse(T value){ this.value = value; }

    private JsonResponse(String error){ this.error = error; }
    public static <T> JsonResponse<T> getErrorResponse(String error){
        return new JsonResponse<T>(error);
    }
}
